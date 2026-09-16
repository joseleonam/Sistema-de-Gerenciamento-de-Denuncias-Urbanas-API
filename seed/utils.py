# seed/utils.py
import random
from datetime import datetime, timedelta

from faker import Faker

from seed.constants import (
    LOGRADOUROS_TIPOS,
    TITULOS_BASE,
)

fake = Faker("pt_BR")


def random_date(
    start_year: int = 2023,
    end_year: int = 2025,
) -> datetime:

    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)

    delta = end - start

    return start + timedelta(
        days=random.randint(0, delta.days)
    )


def generate_title(
    bairro: str,
    logradouro: str,
) -> str:

    template = random.choice(TITULOS_BASE)

    return template.format(
        tipo=random.choice(LOGRADOUROS_TIPOS),
        nome=fake.last_name(),
        nome2=fake.last_name(),
        bairro=bairro,
        dias=random.randint(1, 30),
        num=random.randint(1, 999),
        logradouro=logradouro,
    )


def random_coordinates():

    latitude = round(
        random.uniform(-3.85, -3.68),
        6
    )

    longitude = round(
        random.uniform(-38.65, -38.40),
        6
    )

    return latitude, longitude