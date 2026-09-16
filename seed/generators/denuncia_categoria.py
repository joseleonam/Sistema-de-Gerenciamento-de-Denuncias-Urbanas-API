# seed/generators/denuncia_categoria.py
from app.models.associations import DenunciaCategoria


def generate_denuncia_categoria(
    denuncia,
    categoria,
):
    return DenunciaCategoria(
        denuncia_id=denuncia.id,
        categoria_id=categoria.id,
    )