# seed/generators/atendimentos.py
import random
from datetime import timedelta

from app.models.atendimento import Atendimento
from seed.constants import ORGAOS, fake


def generate_atendimento(denuncia):
    data_inicio = denuncia.created_at + timedelta(
        days=random.randint(1, 15)
    )

    concluido = random.random() > 0.4

    return Atendimento(
        orgao_responsavel=random.choice(ORGAOS),
        responsavel_nome=(
            fake.name()
            if random.random() > 0.3
            else None
        ),
        observacao=(
            fake.sentence(nb_words=12)
            if random.random() > 0.2
            else None
        ),
        data_inicio=data_inicio,
        data_conclusao=(
            data_inicio + timedelta(
                days=random.randint(1, 30)
            )
            if concluido
            else None
        ),
        custo_estimado=(
            round(random.uniform(500, 50000), 2)
            if random.random() > 0.3
            else None
        ),
        denuncia=denuncia,
    )