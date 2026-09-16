# seed/services/denuncia_service.py
import random

from sqlalchemy.ext.asyncio import AsyncSession

from seed.generators.denuncia_categoria import (
    generate_denuncia_categoria,
)
from seed.generators.denuncias import (
    generate_denuncia,
)


async def seed_denuncias(
    session: AsyncSession,
    usuarios,
    localizacoes,
    categorias,
    total: int = 150,
):
    denuncias = []

    for _ in range(total):
        denuncia = generate_denuncia(
            usuario=random.choice(usuarios),
            localizacao=random.choice(localizacoes),
        )

        session.add(denuncia)

        denuncias.append(denuncia)

    await session.flush()

    associacoes = []

    for denuncia in denuncias:
        categorias_escolhidas = random.sample(
            categorias,
            k=random.randint(1, 3),
        )

        for categoria in categorias_escolhidas:
            associacoes.append(
                generate_denuncia_categoria(
                    denuncia,
                    categoria,
                )
            )

    session.add_all(associacoes)

    await session.flush()

    print(f"✓ {len(denuncias)} denúncias")
    print(f"✓ {len(associacoes)} associações")

    return denuncias