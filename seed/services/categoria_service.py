# seed/services/categoria_service.py
from sqlalchemy.ext.asyncio import AsyncSession

from seed.generators.categorias import (
    generate_categorias,
)


async def seed_categorias(
    session: AsyncSession,
):
    categorias = generate_categorias()

    session.add_all(categorias)

    await session.flush()

    print(f"✓ {len(categorias)} categorias")

    return categorias