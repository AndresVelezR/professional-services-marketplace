import json
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import AccessToken


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # 1. Leer y validar token
        query_string = self.scope.get('query_string', b'').decode()
        params = parse_qs(query_string)
        token_list = params.get('token', [])

        if not token_list:
            await self.close(code=4001)
            return

        try:
            access_token = AccessToken(token_list[0])
            user_id = access_token['user_id']
            self.user = await self.get_user(user_id)
        except Exception:
            await self.close(code=4001)
            return

        # 2. Obtener conversación y verificar participante
        self.conversacion_id = str(self.scope['url_route']['kwargs']['conversacion_id'])
        conversacion = await self.get_conversacion(self.conversacion_id)

        if conversacion is None:
            await self.close(code=4004)
            return

        contrato = conversacion.contrato
        if self.user.id not in (contrato.cliente_id, contrato.freelancer_id):
            await self.close(code=4003)
            return

        # 3. Unirse al grupo y aceptar
        self.room_group = f'chat_{self.conversacion_id}'
        await self.channel_layer.group_add(self.room_group, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        if hasattr(self, 'room_group'):
            await self.channel_layer.group_discard(self.room_group, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            contenido = data.get('contenido', '').strip()
        except (json.JSONDecodeError, AttributeError):
            return

        if not contenido:
            return

        mensaje = await self.crear_mensaje(contenido)

        await self.channel_layer.group_send(
            self.room_group,
            {
                'type': 'chat_message',
                'mensaje': {
                    'id': str(mensaje.id),
                    'contenido': mensaje.contenido,
                    'emisor': {
                        'nombre_completo': await self.get_nombre_completo(),
                        'iniciales': self.get_iniciales(),
                    },
                    'leido': False,
                    'created_at': mensaje.created_at.isoformat(),
                },
            },
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event['mensaje']))

    # --- DB helpers ---

    @database_sync_to_async
    def get_user(self, user_id):
        from usuarios.models import Usuario
        return Usuario.objects.select_related('perfil').get(pk=user_id)

    @database_sync_to_async
    def get_conversacion(self, conversacion_id):
        from .models import Conversacion
        try:
            return Conversacion.objects.select_related(
                'contrato', 'contrato__cliente', 'contrato__freelancer'
            ).get(pk=conversacion_id)
        except Conversacion.DoesNotExist:
            return None

    @database_sync_to_async
    def crear_mensaje(self, contenido):
        from .models import Conversacion, Mensaje
        conversacion = Conversacion.objects.get(pk=self.conversacion_id)
        return Mensaje.objects.create(
            conversacion=conversacion,
            emisor=self.user,
            contenido=contenido,
        )

    @database_sync_to_async
    def get_nombre_completo(self):
        return self.user.perfil.nombre_completo

    def get_iniciales(self):
        f = self.user.first_name[:1] if self.user.first_name else ''
        l = self.user.last_name[:1] if self.user.last_name else ''
        return f'{f}{l}'.upper()
