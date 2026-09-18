const Database = require('better-sqlite3');

const db = new Database('denuncias.db');

db.pragma('foreign_keys = ON');


// ==========================
// USUÁRIOS
// ==========================

db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        cpf TEXT NOT NULL UNIQUE,
        telefone TEXT,
        ativo INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`);


// ==========================
// CATEGORIAS
// ==========================

db.exec(`
    CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        descricao TEXT,
        ativa INTEGER NOT NULL DEFAULT 1
    );
`);


// ==========================
// LOCALIZAÇÕES
// ==========================

db.exec(`
    CREATE TABLE IF NOT EXISTS localizacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        logradouro TEXT NOT NULL,
        numero TEXT,
        complemento TEXT,
        bairro TEXT NOT NULL,
        cidade TEXT NOT NULL,
        estado TEXT NOT NULL,
        cep TEXT,
        latitude REAL,
        longitude REAL
    );
`);


// ==========================
// STATUS
// ==========================

db.exec(`
    CREATE TABLE IF NOT EXISTS status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        situacao TEXT NOT NULL DEFAULT 'aberto',
        descricao TEXT,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`);


// ==========================
// DENÚNCIAS
// ==========================

db.exec(`
    CREATE TABLE IF NOT EXISTS denuncias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        prioridade TEXT NOT NULL DEFAULT 'media',
        usuario_id INTEGER NOT NULL,
        localizacao_id INTEGER NOT NULL,
        status_id INTEGER,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (usuario_id)
            REFERENCES usuarios(id),

        FOREIGN KEY (localizacao_id)
            REFERENCES localizacoes(id),

        FOREIGN KEY (status_id)
            REFERENCES status(id)
    );
`);


// ==========================
// DENÚNCIA ↔ CATEGORIA
// ==========================

db.exec(`
    CREATE TABLE IF NOT EXISTS denuncia_categoria (
        denuncia_id INTEGER NOT NULL,
        categoria_id INTEGER NOT NULL,

        PRIMARY KEY (denuncia_id, categoria_id),

        FOREIGN KEY (denuncia_id)
            REFERENCES denuncias(id)
            ON DELETE CASCADE,

        FOREIGN KEY (categoria_id)
            REFERENCES categorias(id)
            ON DELETE CASCADE
    );
`);


module.exports = db;