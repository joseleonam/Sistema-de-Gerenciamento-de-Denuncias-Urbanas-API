# seed/generators/denuncias.py
import random
from datetime import timedelta

from app.models.denuncia import Denuncia
from app.models.enums import PrioridadeEnum
from seed.constants import fake
from seed.utils import generate_title, random_date

from .status import generate_status


def generate_denuncia(
    usuario,
    localizacao,
):
    created_at = random_date(2023, 2025)

    status = generate_status(created_at)

    prioridade = random.choices(
        list(PrioridadeEnum),
        weights=[20, 40, 30, 10],
    )[0]

    titulo = generate_title(
        bairro=localizacao.bairro,
        logradouro=localizacao.logradouro,
    )

    denuncia = Denuncia(
        titulo=titulo,
        descricao=fake.paragraph(
            nb_sentences=random.randint(2, 5)
        ),
        prioridade=prioridade,
        created_at=created_at,
        updated_at=created_at + timedelta(
            days=random.randint(0, 10)
        ),
        usuario=usuario,
        localizacao=localizacao,
        status=status,
    )

    return denuncia