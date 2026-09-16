# seed/constants.py
from faker import Faker
fake = Faker("pt_BR")


# ─────────────────────────────────────────────
# Dados contextuais para o domínio
# ─────────────────────────────────────────────

CATEGORIAS_DATA = [
    ("Buracos e Pavimentação", "Problemas com buracos, remendos e deterioração do asfalto"),
    ("Iluminação Pública", "Postes apagados, lâmpadas queimadas ou falta de iluminação"),
    ("Coleta de Lixo", "Falhas na coleta regular de resíduos domésticos"),
    ("Lixo Irregular", "Descarte irregular de lixo em locais não autorizados"),
    ("Alagamento e Drenagem", "Pontos de alagamento, bueiros entupidos e problemas de drenagem"),
    ("Calçadas e Acessibilidade", "Calçadas danificadas, irregulares ou sem acessibilidade"),
    ("Arborização Urbana", "Árvores com risco de queda, galhos perigosos ou poda necessária"),
    ("Água e Esgoto", "Vazamentos de água, esgoto a céu aberto ou falta de saneamento"),
    ("Sinalização de Trânsito", "Placas danificadas, semáforos com defeito ou faixas apagadas"),
    ("Edificações em Risco", "Prédios ou muros com risco de desabamento"),
    ("Vandalismo", "Depredação de mobiliário urbano, pichações e danos ao patrimônio"),
    ("Fauna Urbana", "Animais soltos, pombos em excesso, roedores ou outros animais perigosos"),
]

ORGAOS = [
    "Secretaria de Infraestrutura Urbana",
    "SEUMA - Secretaria de Urbanismo e Meio Ambiente",
    "EMLURB - Empresa de Limpeza Urbana",
    "CAGECE - Companhia de Água e Esgoto",
    "ENEL - Distribuição de Energia",
    "DETRAN-CE",
    "AMC - Autarquia Municipal de Trânsito",
    "Defesa Civil Municipal",
    "Secretaria de Saúde",
    "SEMACE - Superintendência do Meio Ambiente",
]

BAIRROS_FORTALEZA = [
    "Centro", "Meireles", "Aldeota", "Varjota", "Mucuripe",
    "Bairro de Fátima", "Benfica", "Montese", "Parangaba", "Messejana",
    "Maraponga", "Mondubim", "Bom Jardim", "Granja Lisboa", "Granja Portugal",
    "Conjunto Ceará", "Jangurussu", "Barroso", "Ancuri", "Passaré",
    "Cocó", "Guararapes", "Água Fria", "Itaperi", "Serrinha",
    "Parquelândia", "Amadeu Furtado", "Damas", "Fátima", "Antônio Bezerra",
]

LOGRADOUROS_TIPOS = ["Rua", "Avenida", "Travessa", "Alameda", "Praça"]

TITULOS_BASE = [
    "Buraco profundo na {tipo} {nome} causa acidentes",
    "Poste sem iluminação há {dias} dias no bairro {bairro}",
    "Lixo acumulado na esquina da {tipo} {nome} com {nome2}",
    "Alagamento recorrente na {tipo} {nome} durante chuvas",
    "Calçada destruída impede passagem de cadeirantes na {bairro}",
    "Árvore com risco de queda na {tipo} {nome} número {num}",
    "Vazamento de esgoto na {tipo} {nome} há {dias} dias",
    "Semáforo com defeito causa congestionamento na {bairro}",
    "Muro com risco de desabamento na {tipo} {nome}",
    "Pichação extensa em muro histórico no {bairro}",
]
