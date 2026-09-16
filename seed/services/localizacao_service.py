# seed/services/localizacao_service.py
from sqlalchemy.ext.asyncio import AsyncSession

from seed.generators.localizacoes import (
    generate_localizacao,
)


async def seed_localizacoes(
    session: AsyncSession,
    total: int = 150,
):
    localizacoes = [
        generate_localizacao()
        for _ in range(total)
    ]

    session.add_all(localizacoes)

    await session.flush()

    print(f"✓ {len(localizacoes)} localizações")

    return localizacoes