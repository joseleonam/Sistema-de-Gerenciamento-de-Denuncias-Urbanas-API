# seed/generators/status.py
import random
from datetime import timedelta

from app.models.enums import SituacaoEnum
from app.models.status import Status


def generate_status(created_at):
    situacao = random.choices(
        list(SituacaoEnum),
        weights=[30, 20, 25, 20, 5],
    )[0]

    return Status(
        situacao=situacao,
        descricao=random.choice(
            [
                "Aguardando triagem pela equipe técnica.",
                "Equipe de campo acionada.",
                "Problema solucionado.",
                "Encaminhado ao órgão competente.",
                None,
            ]
        ),
        updated_at=created_at + timedelta(
            days=random.randint(0, 30)
        ),
    )