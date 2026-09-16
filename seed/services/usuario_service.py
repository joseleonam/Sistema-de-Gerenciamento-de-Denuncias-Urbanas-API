# seed/services/usuario_service.py
from sqlalchemy.ext.asyncio import AsyncSession

from seed.generators.usuarios import (
    generate_usuario,
)


async def seed_usuarios(
    session: AsyncSession,
    total: int = 150,
):
    usuarios = [
        generate_usuario()
        for _ in range(total)
    ]

    session.add_all(usuarios)

    await session.flush()

    print(f"✓ {len(usuarios)} usuários")

    return usuarios