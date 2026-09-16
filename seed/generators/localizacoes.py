# seed/generators/localizacoes.py
import random

from app.models.localizacao import Localizacao
from seed.constants import (
    BAIRROS_FORTALEZA,
    LOGRADOUROS_TIPOS,
    fake,
)
from seed.utils import random_coordinates


def generate_localizacao() -> Localizacao:
    latitude, longitude = random_coordinates()

    tipo = random.choice(LOGRADOUROS_TIPOS)

    return Localizacao(
        logradouro=f"{tipo} {fake.street_name()}",
        numero=str(random.randint(1, 9999)),
        complemento=random.choice(
            [
                None,
                "Próximo ao mercado",
                "Em frente à escola",
                "Esquina",
            ]
        ),
        bairro=random.choice(BAIRROS_FORTALEZA),
        cidade="Fortaleza",
        estado="CE",
        cep=fake.postcode(),
        latitude=latitude,
        longitude=longitude,
    )