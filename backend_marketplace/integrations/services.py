import logging

from django.conf import settings

from publicaciones.models import Publicacion

from .adapters.gemini_marketplace_assistant import GeminiMarketplaceAssistantAdapter
from .adapters.local_marketplace_assistant import LocalMarketplaceAssistantAdapter
from .ports import (
    MarketplaceAssistanceResult,
    MarketplaceAssistantError,
    MarketplaceAssistantPort,
)


logger = logging.getLogger(__name__)


def get_public_services_feed_queryset():
    return Publicacion.objects.activas().select_related('creador__perfil')


def build_public_service_detail_url(publicacion_id):
    base_url = settings.FRONTEND_PUBLIC_BASE_URL.rstrip('/')
    return f'{base_url}/es/services/{publicacion_id}'


class MarketplaceAssistantService:
    def __init__(
        self,
        assistant: MarketplaceAssistantPort,
        fallback: MarketplaceAssistantPort | None = None,
    ):
        self.assistant = assistant
        self.fallback = fallback

    def summarize_service(
        self,
        title: str,
        description: str,
    ) -> MarketplaceAssistanceResult:
        try:
            return self.assistant.summarize_service(
                title=title,
                description=description,
            )
        except MarketplaceAssistantError as exc:
            if self.fallback is None:
                raise
            logger.warning(
                'Gemini assistant failed; using local fallback: %s',
                exc,
            )
            return self.fallback.summarize_service(
                title=title,
                description=description,
            )


def get_marketplace_assistant() -> MarketplaceAssistantService:
    local_adapter = LocalMarketplaceAssistantAdapter()

    if settings.USE_GEMINI and settings.GEMINI_API_KEY:
        gemini_adapter = GeminiMarketplaceAssistantAdapter(
            api_key=settings.GEMINI_API_KEY,
            model=settings.GEMINI_MODEL,
            timeout_seconds=settings.GEMINI_TIMEOUT_SECONDS,
        )
        return MarketplaceAssistantService(
            assistant=gemini_adapter,
            fallback=local_adapter,
        )

    if settings.USE_GEMINI:
        logger.info('Gemini API key missing; using local adapter.')
    else:
        logger.info('Gemini assistant disabled; using local adapter.')

    return MarketplaceAssistantService(assistant=local_adapter)
