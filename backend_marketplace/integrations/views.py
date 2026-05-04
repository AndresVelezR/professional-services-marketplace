from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import get_marketplace_assistant


TITLE_MAX_LENGTH = 200
DESCRIPTION_MAX_LENGTH = 3000


class SummarizeServiceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        title = request.data.get('title')
        description = request.data.get('description')

        errors = {}
        title = self._validate_text_field(
            value=title,
            field='title',
            max_length=TITLE_MAX_LENGTH,
            errors=errors,
        )
        description = self._validate_text_field(
            value=description,
            field='description',
            max_length=DESCRIPTION_MAX_LENGTH,
            errors=errors,
        )

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        assistant = get_marketplace_assistant()
        result = assistant.summarize_service(
            title=title,
            description=description,
        )
        return Response(result.to_dict())

    def _validate_text_field(self, value, field, max_length, errors):
        if not isinstance(value, str):
            errors[field] = 'This field is required and must be a string.'
            return ''

        cleaned = value.strip()
        if not cleaned:
            errors[field] = 'This field cannot be empty.'
        elif len(cleaned) > max_length:
            errors[field] = f'This field cannot exceed {max_length} characters.'

        return cleaned
