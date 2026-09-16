# seed/main.py
import asyncio

from sqlmodel import select

from app.models.categoria import Categoria

from seed.database import (
    AsyncSessionLocal,
    engine,
)

from seed.services.atendimento_service import (
    seed_atendimentos,
)
from seed.services.categoria_service import (
    seed_categorias,
)
from seed.services.denuncia_service import (
    seed_denuncias,
)
from seed.services.localizacao_service import (
    seed_localizacoes,
)
from seed.services.usuario_service import (
    seed_usuarios,
)


async def seed():
    async with AsyncSessionLocal() as session:

        print("🌱 Iniciando carga de dados...\n")

        # EVITA DUPLICAR DADOS
        result = await session.execute(
            select(Categoria)
        )

        if result.first():
            print("⚠️ Banco já populado.")
            return

        try:

            categorias = await seed_categorias(session)

            usuarios = await seed_usuarios(session)

            localizacoes = await seed_localizacoes(session)

            denuncias = await seed_denuncias(
                session=session,
                usuarios=usuarios,
                localizacoes=localizacoes,
                categorias=categorias,
            )

            await seed_atendimentos(
                session=session,
                denuncias=denuncias,
            )

            await session.commit()

            print("\n✅ Seed concluído com sucesso!")

        except Exception as e:

            await session.rollback()

            print(f"\n❌ Erro durante o seed: {e}")


async def main():
    await seed()

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())