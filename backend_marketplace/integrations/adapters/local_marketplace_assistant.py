from integrations.ports import MarketplaceAssistanceResult


TIMELINE_WORDS = {
    'day',
    'days',
    'week',
    'weeks',
    'month',
    'months',
    'timeline',
    'deadline',
    'delivery',
    'entrega',
    'dias',
    'días',
    'semana',
    'semanas',
    'mes',
    'meses',
    'cronograma',
    'fecha',
    'plazo',
}

DELIVERABLE_WORDS = {
    'deliverable',
    'deliverables',
    'include',
    'includes',
    'package',
    'file',
    'files',
    'revision',
    'revisions',
    'entregable',
    'entregables',
    'incluye',
    'paquete',
    'archivo',
    'archivos',
    'revision',
    'revisión',
    'revisiones',
}


class LocalMarketplaceAssistantAdapter:
    provider = 'local'

    def summarize_service(
        self,
        title: str,
        description: str,
    ) -> MarketplaceAssistanceResult:
        cleaned_title = title.strip()
        cleaned_description = description.strip()
        description_preview = self._description_preview(cleaned_description)
        summary = (
            f'{cleaned_title}: {description_preview}'
            if description_preview
            else cleaned_title
        )

        return MarketplaceAssistanceResult(
            summary=summary[:280],
            suggestions=self._suggestions(cleaned_title, cleaned_description),
            provider=self.provider,
        )

    def _description_preview(self, description: str) -> str:
        for separator in ('.', '!', '?'):
            if separator in description:
                first_sentence = description.split(separator, 1)[0].strip()
                if first_sentence:
                    return f'{first_sentence}{separator}'

        words = description.split()
        if len(words) > 28:
            return f'{" ".join(words[:28])}...'
        return description

    def _suggestions(self, title: str, description: str) -> list[str]:
        text = f'{title} {description}'.lower()
        suggestions = []

        if len(description.split()) < 12:
            suggestions.append('Add more detail about the service scope and process.')
        else:
            suggestions.append('Review the description for clarity and focus.')

        if not any(word in text for word in DELIVERABLE_WORDS):
            suggestions.append('Specify the concrete deliverables the client will receive.')

        if not any(word in text for word in TIMELINE_WORDS):
            suggestions.append('Include the delivery time or expected timeline.')

        suggestions.append('Make sure the service value proposition is explicit.')
        return suggestions[:3]
