from abc import ABC, abstractmethod


class EmailSendError(Exception):
    pass


class IEmailSender(ABC):
    @abstractmethod
    def send_email(self, recipient: str, subject: str, body: str) -> None:
        pass