# seed/generators/usuarios.py
import random

from app.models.usuario import Usuario
from seed.constants import fake
from seed.utils import random_date


def generate_usuario() -> Usuario:
    return Usuario(
        nome=fake.name(),
        email=fake.unique.email(),
        cpf=fake.unique.cpf(),
        telefone=fake.phone_number()[:20],
        ativo=random.random() > 0.05,
        created_at=random_date(2022, 2024),
    )