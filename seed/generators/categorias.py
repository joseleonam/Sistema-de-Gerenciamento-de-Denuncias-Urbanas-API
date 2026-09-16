# seed/generators/categorias.py
from app.models.categoria import Categoria
from seed.constants import CATEGORIAS_DATA


def generate_categorias() -> list[Categoria]:
    categorias = []

    for nome, descricao in CATEGORIAS_DATA:
        categorias.append(
            Categoria(
                nome=nome,
                descricao=descricao,
                ativa=True,
            )
        )

    return categorias