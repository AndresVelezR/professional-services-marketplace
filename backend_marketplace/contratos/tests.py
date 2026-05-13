from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from publicaciones.models import Publicacion
from .models import Contrato, Propuesta

User = get_user_model()


class ContratoEstadoTests(APITestCase):
    def setUp(self):
        self.cliente = User.objects.create_user(
            username='cliente@test.com',
            email='cliente@test.com',
            password='pass1234',
        )
        self.freelancer = User.objects.create_user(
            username='freelancer@test.com',
            email='freelancer@test.com',
            password='pass1234',
        )
        publicacion = Publicacion.objects.create(
            titulo='Servicio Test',
            descripcion='Descripción',
            categoria='desarrollo',
            precio='200.00',
            tiempo_entrega='7 días',
            estado='publicado',
            creador=self.freelancer,
        )
        propuesta = Propuesta.objects.create(
            publicacion=publicacion,
            cliente=self.cliente,
            mensaje='Me interesa',
            precio_propuesto='200.00',
            estado='aceptada',
        )
        self.contrato = Contrato.objects.create(
            propuesta=propuesta,
            cliente=self.cliente,
            freelancer=self.freelancer,
            precio='200.00',
        )

    def _url(self):
        return f'/api/contratos/contratos/{self.contrato.id}/'

    def test_cliente_puede_marcar_completado(self):
        self.client.force_authenticate(user=self.cliente)
        res = self.client.patch(self._url(), {'estado': 'completado'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.contrato.refresh_from_db()
        self.assertEqual(self.contrato.estado, Contrato.Estado.COMPLETADO)

    def test_freelancer_no_puede_marcar_completado(self):
        self.client.force_authenticate(user=self.freelancer)
        res = self.client.patch(self._url(), {'estado': 'completado'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.contrato.refresh_from_db()
        self.assertEqual(self.contrato.estado, Contrato.Estado.ACTIVO)

    def test_freelancer_no_puede_cancelar(self):
        self.client.force_authenticate(user=self.freelancer)
        res = self.client.patch(self._url(), {'estado': 'cancelado'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.contrato.refresh_from_db()
        self.assertEqual(self.contrato.estado, Contrato.Estado.ACTIVO)

    def test_cliente_puede_cancelar(self):
        self.client.force_authenticate(user=self.cliente)
        res = self.client.patch(self._url(), {'estado': 'cancelado'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.contrato.refresh_from_db()
        self.assertEqual(self.contrato.estado, Contrato.Estado.CANCELADO)

    def test_is_client_verdadero_para_cliente(self):
        self.client.force_authenticate(user=self.cliente)
        res = self.client.get(self._url())
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['is_client'])
        self.assertFalse(res.data['is_freelancer'])

    def test_is_freelancer_verdadero_para_freelancer(self):
        self.client.force_authenticate(user=self.freelancer)
        res = self.client.get(self._url())
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertFalse(res.data['is_client'])
        self.assertTrue(res.data['is_freelancer'])
