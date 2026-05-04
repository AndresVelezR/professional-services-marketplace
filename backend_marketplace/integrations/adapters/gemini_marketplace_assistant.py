import json
from urllib import error, parse, request

from integrations.ports import MarketplaceAssistanceResult, MarketplaceAssistantError


class GeminiMarketplaceAssistantAdapter:
    provider = 'gemini'

    def __init__(self, api_key: str, model: str, timeout_seconds: int):
        self.api_key = api_key
        self.model = model
        self.timeout_seconds = timeout_seconds

    def summarize_service(
        self,
        title: str,
        description: str,
    ) -> MarketplaceAssistanceResult:
        payload = {
            'contents': [
                {
                    'parts': [
                        {
                            'text': self._build_prompt(
                                title=title,
                                description=description,
                            ),
                        },
                    ],
                },
            ],
            'generationConfig': {
                'temperature': 0.2,
                'maxOutputTokens': 300,
                'responseMimeType': 'application/json',
            },
        }

        try:
            response_data = self._post(payload)
            text = self._extract_text(response_data)
            return self._normalize_response(text)
        except MarketplaceAssistantError:
            raise
        except (OSError, KeyError, TypeError, ValueError, json.JSONDecodeError) as exc:
            raise MarketplaceAssistantError(
                f'Gemini adapter error: {exc.__class__.__name__}'
            ) from exc

    def _build_prompt(self, title: str, description: str) -> str:
        return (
            'You help review professional service marketplace listings. '
            'Use only the title and description below. '
            'Return JSON with keys "summary" and "suggestions". '
            '"summary" must be one concise sentence. '
            '"suggestions" must contain two or three practical suggestions. '
            f'Title: {title}\n'
            f'Description: {description}'
        )

    def _post(self, payload):
        model = parse.quote(self.model, safe='')
        url = (
            'https://generativelanguage.googleapis.com/v1beta/models/'
            f'{model}:generateContent'
        )
        data = json.dumps(payload).encode('utf-8')
        req = request.Request(
            url=url,
            data=data,
            headers={
                'Content-Type': 'application/json',
                'x-goog-api-key': self.api_key,
            },
            method='POST',
        )

        try:
            with request.urlopen(req, timeout=self.timeout_seconds) as response:
                return json.loads(response.read().decode('utf-8'))
        except error.HTTPError as exc:
            raise MarketplaceAssistantError(self._http_error_message(exc)) from exc
        except error.URLError as exc:
            raise MarketplaceAssistantError(
                f'Gemini network error: {exc.reason.__class__.__name__}'
            ) from exc

    def _http_error_message(self, exc):
        try:
            body = json.loads(exc.read().decode('utf-8'))
            error_data = body.get('error', {})
        except (ValueError, TypeError):
            return f'Gemini HTTP {exc.code}'

        status = str(error_data.get('status', '')).strip()
        message = str(error_data.get('message', '')).strip()
        detail = ' '.join(part for part in (status, message[:160]) if part)
        if detail:
            return f'Gemini HTTP {exc.code}: {detail}'
        return f'Gemini HTTP {exc.code}'

    def _extract_text(self, response_data):
        return response_data['candidates'][0]['content']['parts'][0]['text']

    def _normalize_response(self, text: str) -> MarketplaceAssistanceResult:
        parsed = json.loads(text)
        summary = str(parsed['summary']).strip()
        suggestions = parsed['suggestions']

        if not summary or not isinstance(suggestions, list):
            raise ValueError('Invalid Gemini response shape.')

        cleaned_suggestions = [
            str(suggestion).strip()
            for suggestion in suggestions[:3]
            if str(suggestion).strip()
        ]
        if not cleaned_suggestions:
            raise ValueError('Gemini response did not include suggestions.')

        return MarketplaceAssistanceResult(
            summary=summary,
            suggestions=cleaned_suggestions,
            provider=self.provider,
        )
