from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Publicacion

User = get_user_model()

CAMPOS = {
    'titulo': 'Servicio de prueba',
    'descripcion': 'Descripción de prueba',
    'categoria': 'desarrollo',
    'precio': '100.00',
    'tiempo_entrega': '3 días',
    'estado': 'publicado',
}


class PublicacionOwnerTests(APITestCase):
    def setUp(self):
        self.creador = User.objects.create_user(
            username='creador@test.com',
            email='creador@test.com',
            password='pass1234',
        )
        self.otro = User.objects.create_user(
            username='otro@test.com',
            email='otro@test.com',
            password='pass1234',
        )
        self.publicacion = Publicacion.objects.create(
            creador=self.creador,
            **CAMPOS,
        )

    def test_creador_puede_actualizar_publicacion(self):
        self.client.force_authenticate(user=self.creador)
        res = self.client.patch(
            f'/api/publicaciones/{self.publicacion.id}/',
            {'titulo': 'Título actualizado'},
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.publicacion.refresh_from_db()
        self.assertEqual(self.publicacion.titulo, 'Título actualizado')

    def test_otro_usuario_no_puede_actualizar_publicacion(self):
        self.client.force_authenticate(user=self.otro)
        res = self.client.patch(
            f'/api/publicaciones/{self.publicacion.id}/',
            {'titulo': 'Intento no autorizado'},
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_creador_puede_cerrar_publicacion(self):
        self.client.force_authenticate(user=self.creador)
        res = self.client.delete(f'/api/publicaciones/{self.publicacion.id}/')
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.publicacion.refresh_from_db()
        self.assertEqual(self.publicacion.estado, Publicacion.Estado.CERRADO)

    def test_otro_usuario_no_puede_cerrar_publicacion(self):
        self.client.force_authenticate(user=self.otro)
        res = self.client.delete(f'/api/publicaciones/{self.publicacion.id}/')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_mis_publicaciones_devuelve_solo_las_propias(self):
        Publicacion.objects.create(
            titulo='Publicación de otro',
            descripcion='Desc',
            categoria='diseno',
            precio='50.00',
            tiempo_entrega='5 días',
            estado='publicado',
            creador=self.otro,
        )
        self.client.force_authenticate(user=self.creador)
        res = self.client.get('/api/publicaciones/mias/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        ids = [p['id'] for p in res.data['results']]
        self.assertIn(str(self.publicacion.id), ids)
        self.assertEqual(len(ids), 1)

    def test_mis_publicaciones_requiere_autenticacion(self):
        res = self.client.get('/api/publicaciones/mias/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_is_owner_verdadero_para_creador(self):
        self.client.force_authenticate(user=self.creador)
        res = self.client.get(f'/api/publicaciones/{self.publicacion.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['is_owner'])

    def test_is_owner_falso_para_otro_usuario(self):
        self.client.force_authenticate(user=self.otro)
        res = self.client.get(f'/api/publicaciones/{self.publicacion.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertFalse(res.data['is_owner'])
