import resend
from django.conf import settings

from infrastructure.emails.interface import IEmailSender, EmailSendError


class EmailService(IEmailSender):
    def __init__(self) -> None:
        resend.api_key = settings.RESEND_API_KEY

    def send_email(self, recipient: str, subject: str, body: str) -> None:
        try:
            resend.Emails.send({
                "from": settings.RESEND_FROM_EMAIL,
                "to": recipient,
                "subject": subject,
                "html": body,
            })
        except Exception as e:
            raise EmailSendError(str(e)) from e
