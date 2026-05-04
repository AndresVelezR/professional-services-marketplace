import json
import re
from urllib import error, parse, request

from integrations.ports import MarketplaceAssistanceResult, MarketplaceAssistantError


DEFAULT_GEMINI_SUGGESTIONS = [
    'Review the description for clarity.',
    'Include deliverables, timeline, and expected outcome.',
]


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
                'maxOutputTokens': 768,
                'responseMimeType': 'application/json',
                'thinkingConfig': {
                    'thinkingBudget': 0,
                },
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
            'Return only valid JSON. Do not include markdown, code fences, '
            'or explanatory text. The JSON shape must be: '
            '{"summary":"short summary in the same language as the input",'
            '"suggestions":["first practical suggestion",'
            '"second practical suggestion","third practical suggestion"]}. '
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
        candidates = response_data.get('candidates')
        if not candidates:
            raise MarketplaceAssistantError('missing response candidate')

        candidate = candidates[0]
        content = candidate.get('content') if isinstance(candidate, dict) else None
        parts = content.get('parts') if isinstance(content, dict) else None
        if not isinstance(parts, list):
            finish_reason = candidate.get('finishReason', 'unknown')
            raise MarketplaceAssistantError(
                f'missing response text: {finish_reason}'
            )

        text_parts = [
            part['text']
            for part in parts
            if isinstance(part, dict) and isinstance(part.get('text'), str)
        ]
        if not text_parts:
            raise MarketplaceAssistantError('missing response text')
        return '\n'.join(text_parts)

    def _normalize_response(self, text: str) -> MarketplaceAssistanceResult:
        parsed = self._parse_response_object(text)
        summary = parsed.get('summary')
        if not isinstance(summary, str) or not summary.strip():
            raise MarketplaceAssistantError('missing summary')

        cleaned_suggestions = self._normalize_suggestions(parsed.get('suggestions'))
        if not cleaned_suggestions:
            cleaned_suggestions = DEFAULT_GEMINI_SUGGESTIONS

        return MarketplaceAssistanceResult(
            summary=summary.strip(),
            suggestions=cleaned_suggestions,
            provider=self.provider,
        )

    def _parse_response_object(self, text: str) -> dict:
        for candidate in self._json_candidates(text):
            try:
                parsed = json.loads(candidate)
            except json.JSONDecodeError:
                continue
            if isinstance(parsed, dict):
                return parsed
            raise MarketplaceAssistantError('JSON root must be an object')

        raise MarketplaceAssistantError('JSON parsing failed')

    def _json_candidates(self, text: str):
        cleaned = text.strip()
        if cleaned:
            yield cleaned

        for match in re.finditer(r'```(?:json)?\s*(.*?)\s*```', cleaned, re.DOTALL | re.I):
            fenced = match.group(1).strip()
            if fenced:
                yield fenced

        balanced = self._first_balanced_json_object(cleaned)
        if balanced:
            yield balanced

    def _first_balanced_json_object(self, text: str) -> str:
        start = text.find('{')
        if start == -1:
            return ''

        depth = 0
        in_string = False
        escaped = False

        for index in range(start, len(text)):
            char = text[index]

            if in_string:
                if escaped:
                    escaped = False
                elif char == '\\':
                    escaped = True
                elif char == '"':
                    in_string = False
                continue

            if char == '"':
                in_string = True
            elif char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth == 0:
                    return text[start : index + 1]

        return ''

    def _normalize_suggestions(self, suggestions) -> list[str]:
        if isinstance(suggestions, str):
            values = [suggestions]
        elif isinstance(suggestions, list):
            values = suggestions
        else:
            return []

        cleaned = []
        for suggestion in values:
            if isinstance(suggestion, (dict, list)):
                continue
            text = str(suggestion).strip()
            if text:
                cleaned.append(text)
            if len(cleaned) == 3:
                break

        return cleaned
