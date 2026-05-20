from infrastructure.emails.interface import IEmailSender


class FakeEmailService(IEmailSender):
    def send_email(self, recipient: str, subject: str, body: str) -> None:
        print("=" * 20)
        print("[FakeEmailService] Email enviado")
        print(f"  Recipient: {recipient}")
        print(f"  Subject:   {subject}")
        print(f"  Body:      {body}")
        print("=" * 20)
