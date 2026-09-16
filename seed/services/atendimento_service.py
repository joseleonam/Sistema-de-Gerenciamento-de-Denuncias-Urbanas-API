# seed/services/atendimento_service.py
import random

from sqlalchemy.ext.asyncio import AsyncSession

from seed.generators.atendimentos import (
    generate_atendimento,
)


async def seed_atendimentos(
    session: AsyncSession,
    denuncias,
    total: int = 120,
):
    atendimentos = []

    denuncias_escolhidas = random.sample(
        denuncias,
        k=min(total, len(denuncias)),
    )

    for denuncia in denuncias_escolhidas:
        for _ in range(random.randint(1, 3)):
            atendimentos.append(
                generate_atendimento(
                    denuncia
                )
            )

    session.add_all(atendimentos)

    await session.flush()

    print(f"✓ {len(atendimentos)} atendimentos")

    return atendimentos