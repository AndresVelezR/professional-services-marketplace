from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient, APIRequestFactory

from publicaciones.models import Publicacion
from usuarios.models import Perfil, Usuario
from usuarios.serializers import PerfilSerializer

from .adapters.dicebear_avatar_provider import dicebear_avatar_url
from .adapters.gemini_marketplace_assistant import GeminiMarketplaceAssistantAdapter
from .adapters.local_marketplace_assistant import LocalMarketplaceAssistantAdapter
from .ports import MarketplaceAssistantError
from .services import get_marketplace_assistant


class PublicServicesFeedEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.creator = Usuario.objects.create_user(
            email='creator@example.com',
            password='Demo1234!',
            first_name='Laura',
            last_name='Gomez',
        )
        Perfil.objects.create(
            usuario=self.creator,
            tipo_usuario=Perfil.TipoUsuario.FREELANCER,
        )

    @override_settings(FRONTEND_PUBLIC_BASE_URL='https://marketplace.example')
    def test_returns_active_services(self):
        publicacion = Publicacion.objects.create(
            titulo='Landing page design',
            descripcion='Responsive landing page for service businesses.',
            categoria=Publicacion.Categoria.DESARROLLO,
            precio='250000.00',
            tiempo_entrega='5 días',
            estado=Publicacion.Estado.PUBLICADO,
            creador=self.creator,
        )

        response = self.client.get(reverse('public-services-feed'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], str(publicacion.id))
        self.assertEqual(response.data[0]['title'], publicacion.titulo)
        self.assertEqual(response.data[0]['price'], '250000.00')
        self.assertEqual(response.data[0]['creator_name'], 'Laura Gomez')
        self.assertEqual(
            response.data[0]['detail_url'],
            f'https://marketplace.example/es/services/{publicacion.id}',
        )
        self.assertIn('created_at', response.data[0])

    def test_does_not_expose_sensitive_fields(self):
        Publicacion.objects.create(
            titulo='Logo design',
            descripcion='Brand identity package. Contact creator@example.com',
            categoria=Publicacion.Categoria.DISENO,
            precio='180000.00',
            tiempo_entrega='3 días',
            estado=Publicacion.Estado.PUBLICADO,
            creador=self.creator,
        )

        response = self.client.get(reverse('public-services-feed'))
        payload = response.json()
        serialized_payload = str(payload)

        self.assertEqual(response.status_code, 200)
        self.assertNotIn('email', payload[0])
        self.assertNotIn('creator@example.com', serialized_payload)
        self.assertNotIn('is_staff', serialized_payload)
        self.assertNotIn('permissions', serialized_payload)

    def test_excludes_closed_services(self):
        Publicacion.objects.create(
            titulo='Published service',
            descripcion='Visible service.',
            categoria=Publicacion.Categoria.MARKETING,
            precio='300000.00',
            tiempo_entrega='4 días',
            estado=Publicacion.Estado.PUBLICADO,
            creador=self.creator,
        )
        Publicacion.objects.create(
            titulo='Closed service',
            descripcion='Hidden service.',
            categoria=Publicacion.Categoria.MARKETING,
            precio='300000.00',
            tiempo_entrega='4 días',
            estado=Publicacion.Estado.CERRADO,
            creador=self.creator,
        )

        response = self.client.get(reverse('public-services-feed'))
        titles = {item['title'] for item in response.data}

        self.assertEqual(response.status_code, 200)
        self.assertEqual(titles, {'Published service'})


class GeminiMarketplaceAssistantAdapterParsingTests(TestCase):
    def setUp(self):
        self.adapter = GeminiMarketplaceAssistantAdapter(
            api_key='test-key',
            model='gemini-2.5-flash',
            timeout_seconds=15,
        )

    def test_parses_exact_json(self):
        result = self.adapter._normalize_response(
            '{"summary":"Clear service summary.","suggestions":["Add timeline.","List deliverables."]}'
        )

        self.assertEqual(result.provider, 'gemini')
        self.assertEqual(result.summary, 'Clear service summary.')
        self.assertEqual(result.suggestions, ['Add timeline.', 'List deliverables.'])

    def test_parses_markdown_fenced_json(self):
        result = self.adapter._normalize_response(
            '```json\n'
            '{"summary":"Fenced summary.","suggestions":["One.","Two."]}\n'
            '```'
        )

        self.assertEqual(result.provider, 'gemini')
        self.assertEqual(result.summary, 'Fenced summary.')

    def test_parses_fenced_json_without_language(self):
        result = self.adapter._normalize_response(
            '```\n'
            '{"summary":"Plain fenced summary.","suggestions":["One.","Two."]}\n'
            '```'
        )

        self.assertEqual(result.provider, 'gemini')
        self.assertEqual(result.summary, 'Plain fenced summary.')

    def test_parses_json_with_extra_text(self):
        result = self.adapter._normalize_response(
            'Here is the result:\n'
            '{"summary":"Embedded summary.","suggestions":["One.","Two.","Three."]}\n'
            'Review before use.'
        )

        self.assertEqual(result.provider, 'gemini')
        self.assertEqual(result.summary, 'Embedded summary.')

    def test_rejects_invalid_text_with_controlled_error(self):
        with self.assertRaises(MarketplaceAssistantError) as ctx:
            self.adapter._normalize_response('This is useful text but not JSON.')

        self.assertIn('JSON parsing failed', str(ctx.exception))

    def test_normalizes_suggestions_string_to_list(self):
        result = self.adapter._normalize_response(
            '{"summary":"Summary.","suggestions":"Add a delivery timeline."}'
        )

        self.assertEqual(result.provider, 'gemini')
        self.assertEqual(result.suggestions, ['Add a delivery timeline.'])

    def test_uses_default_suggestions_when_summary_exists(self):
        result = self.adapter._normalize_response(
            '{"summary":"Summary.","suggestions":[]}'
        )

        self.assertEqual(result.provider, 'gemini')
        self.assertTrue(result.suggestions)

    def test_missing_response_text_raises_controlled_error(self):
        with self.assertRaises(MarketplaceAssistantError) as ctx:
            self.adapter._extract_text(
                {
                    'candidates': [
                        {
                            'content': {},
                            'finishReason': 'MAX_TOKENS',
                        },
                    ],
                }
            )

        self.assertIn('missing response text', str(ctx.exception))


class LocalMarketplaceAssistantAdapterTests(TestCase):
    def test_returns_stable_normalized_output(self):
        adapter = LocalMarketplaceAssistantAdapter()

        first = adapter.summarize_service(
            title='Landing page design',
            description='I will design a responsive landing page. Includes review.',
        )
        second = adapter.summarize_service(
            title='Landing page design',
            description='I will design a responsive landing page. Includes review.',
        )

        self.assertEqual(first, second)
        self.assertEqual(first.provider, 'local')
        self.assertTrue(first.summary)
        self.assertIsInstance(first.suggestions, list)
        self.assertTrue(first.disclaimer)

    def test_returns_different_summaries_for_different_inputs(self):
        adapter = LocalMarketplaceAssistantAdapter()

        first = adapter.summarize_service(
            title='Landing page design',
            description='Responsive page for restaurants with menu sections.',
        )
        second = adapter.summarize_service(
            title='Backend API development',
            description='Build authenticated endpoints for inventory reports.',
        )

        self.assertNotEqual(first.summary, second.summary)
        self.assertIn('Landing page design', first.summary)
        self.assertIn('Backend API development', second.summary)

    def test_returns_contextual_suggestions_for_short_input(self):
        adapter = LocalMarketplaceAssistantAdapter()

        result = adapter.summarize_service(
            title='Logo',
            description='Simple logo.',
        )

        self.assertEqual(result.provider, 'local')
        self.assertTrue(
            any('detail' in suggestion.lower() for suggestion in result.suggestions)
        )


class MarketplaceAssistantFactoryTests(TestCase):
    @override_settings(USE_GEMINI=False, GEMINI_API_KEY='unused')
    def test_selects_local_adapter_when_gemini_is_disabled(self):
        service = get_marketplace_assistant()
        result = service.summarize_service(
            title='Service',
            description='Description for a service.',
        )

        self.assertEqual(result.provider, 'local')

    @override_settings(
        USE_GEMINI=True,
        GEMINI_API_KEY='test-key',
        GEMINI_MODEL='gemini-2.5-flash',
        GEMINI_TIMEOUT_SECONDS=15,
    )
    def test_selects_gemini_adapter_when_enabled_and_key_exists(self):
        service = get_marketplace_assistant()

        self.assertEqual(service.assistant.provider, 'gemini')

    @override_settings(USE_GEMINI=True, GEMINI_API_KEY='')
    def test_selects_local_adapter_when_gemini_key_is_missing(self):
        service = get_marketplace_assistant()
        result = service.summarize_service(
            title='Service',
            description='Description for a service.',
        )

        self.assertEqual(result.provider, 'local')


class SummarizeServiceEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Usuario.objects.create_user(
            email='user@example.com',
            password='Demo1234!',
        )
        Perfil.objects.create(usuario=self.user, tipo_usuario=Perfil.TipoUsuario.CLIENTE)

    @override_settings(USE_GEMINI=False, GEMINI_API_KEY='')
    def test_authenticated_user_can_summarize_service_with_local_provider(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse('summarize-service'),
            {
                'title': 'Landing page design',
                'description': 'I will design a responsive landing page.',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['provider'], 'local')
        self.assertTrue(response.data['summary'])
        self.assertIsInstance(response.data['suggestions'], list)

    def test_rejects_invalid_text(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse('summarize-service'),
            {
                'title': ['Landing page design'],
                'description': '',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('title', response.data)
        self.assertIn('description', response.data)


class DiceBearAvatarFallbackTests(TestCase):
    def test_profile_without_image_returns_deterministic_dicebear_url(self):
        user = Usuario.objects.create_user(
            email='avatar@example.com',
            password='Demo1234!',
        )
        profile = Perfil.objects.create(
            usuario=user,
            tipo_usuario=Perfil.TipoUsuario.CLIENTE,
        )

        first = PerfilSerializer(profile).data['foto_perfil_url']
        second = PerfilSerializer(profile).data['foto_perfil_url']

        self.assertEqual(first, second)
        self.assertIn('https://api.dicebear.com/9.x/initials/svg', first)
        self.assertIn(f'seed={profile.id}', first)
        self.assertNotIn(user.email, first)

    def test_profile_with_image_preserves_uploaded_image_behavior(self):
        request = APIRequestFactory().get('/api/usuarios/perfil/')
        user = Usuario.objects.create_user(
            email='uploaded@example.com',
            password='Demo1234!',
        )
        profile = Perfil.objects.create(
            usuario=user,
            tipo_usuario=Perfil.TipoUsuario.CLIENTE,
            foto_perfil='perfiles/avatar.png',
        )

        with_request = PerfilSerializer(
            profile,
            context={'request': request},
        ).data['foto_perfil_url']
        without_request = PerfilSerializer(profile).data['foto_perfil_url']

        self.assertEqual(
            with_request,
            'http://testserver/media/perfiles/avatar.png',
        )
        self.assertIsNone(without_request)


class DiceBearProviderUnitTests(TestCase):
    def test_url_is_deterministic_for_same_seed(self):
        url1 = dicebear_avatar_url('user-uuid-abc123')
        url2 = dicebear_avatar_url('user-uuid-abc123')
        self.assertEqual(url1, url2)
        self.assertIn('https://api.dicebear.com/9.x/initials/svg', url1)
        self.assertIn('seed=user-uuid-abc123', url1)

    def test_empty_seed_uses_safe_default(self):
        url = dicebear_avatar_url('')
        self.assertIn('https://api.dicebear.com/9.x/initials/svg', url)
        self.assertIn('seed=profile', url)
        self.assertNotIn('@', url)
