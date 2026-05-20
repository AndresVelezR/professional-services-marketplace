import uuid

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from publicaciones.models import Publicacion

from .models import Perfil, Usuario


class PerfilPublicoViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.target_user = Usuario.objects.create_user(
            email='target@test.com',
            password='testpass123!',
            first_name='Juan',
            last_name='Pérez',
        )
        self.target_perfil = Perfil.objects.create(
            usuario=self.target_user,
            bio='Desarrollador backend con 5 años de experiencia.',
            tipo_usuario='freelancer',
            telefono='+57 300 111 2222',
        )

        self.pub_active = Publicacion.objects.create(
            titulo='Servicio activo',
            descripcion='Descripción del servicio.',
            categoria='desarrollo',
            precio=150,
            tiempo_entrega='5 días',
            estado=Publicacion.Estado.PUBLICADO,
            creador=self.target_user,
        )
        self.pub_draft = Publicacion.objects.create(
            titulo='Servicio borrador',
            descripcion='Descripción.',
            categoria='diseno',
            precio=80,
            tiempo_entrega='3 días',
            estado=Publicacion.Estado.BORRADOR,
            creador=self.target_user,
        )
        self.pub_closed = Publicacion.objects.create(
            titulo='Servicio cerrado',
            descripcion='Descripción.',
            categoria='marketing',
            precio=60,
            tiempo_entrega='2 días',
            estado=Publicacion.Estado.CERRADO,
            creador=self.target_user,
        )

        self.requesting_user = Usuario.objects.create_user(
            email='requester@test.com',
            password='testpass123!',
        )
        Perfil.objects.create(usuario=self.requesting_user, tipo_usuario='cliente')

        self.url = f'/api/usuarios/{self.target_user.id}/perfil-publico/'

    def test_authenticated_user_can_view_profile(self):
        self.client.force_authenticate(user=self.requesting_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_user_cannot_view_profile(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_response_does_not_include_email(self):
        self.client.force_authenticate(user=self.requesting_user)
        response = self.client.get(self.url)
        self.assertNotIn('email', response.data)

    def test_response_does_not_include_telefono(self):
        self.client.force_authenticate(user=self.requesting_user)
        response = self.client.get(self.url)
        self.assertNotIn('telefono', response.data)

    def test_active_publication_is_included(self):
        self.client.force_authenticate(user=self.requesting_user)
        response = self.client.get(self.url)
        pub_ids = [p['id'] for p in response.data['publicaciones']]
        self.assertIn(str(self.pub_active.id), pub_ids)

    def test_draft_publication_is_excluded(self):
        self.client.force_authenticate(user=self.requesting_user)
        response = self.client.get(self.url)
        pub_ids = [p['id'] for p in response.data['publicaciones']]
        self.assertNotIn(str(self.pub_draft.id), pub_ids)

    def test_closed_publication_is_excluded(self):
        self.client.force_authenticate(user=self.requesting_user)
        response = self.client.get(self.url)
        pub_ids = [p['id'] for p in response.data['publicaciones']]
        self.assertNotIn(str(self.pub_closed.id), pub_ids)

    def test_safe_fields_are_present(self):
        self.client.force_authenticate(user=self.requesting_user)
        response = self.client.get(self.url)
        data = response.data
        self.assertIn('usuario_id', data)
        self.assertIn('nombre_completo', data)
        self.assertIn('bio', data)
        self.assertIn('tipo_usuario', data)
        self.assertIn('foto_perfil_url', data)
        self.assertIn('habilidades', data)
        self.assertIn('experiencias', data)
        self.assertIn('publicaciones', data)

    def test_nonexistent_profile_returns_404(self):
        self.client.force_authenticate(user=self.requesting_user)
        response = self.client.get(f'/api/usuarios/{uuid.uuid4()}/perfil-publico/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
