from dataclasses import asdict, dataclass
from typing import Protocol


ASSISTANT_DISCLAIMER = (
    'This is an assistant-generated suggestion. Review it before using it.'
)


@dataclass(frozen=True)
class MarketplaceAssistanceResult:
    summary: str
    suggestions: list[str]
    provider: str
    disclaimer: str = ASSISTANT_DISCLAIMER

    def to_dict(self):
        return asdict(self)


class MarketplaceAssistantPort(Protocol):
    def summarize_service(
        self,
        title: str,
        description: str,
    ) -> MarketplaceAssistanceResult:
        ...


class MarketplaceAssistantError(Exception):
    pass
