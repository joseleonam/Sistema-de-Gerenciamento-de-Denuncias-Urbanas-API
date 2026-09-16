const db = require('../database/database');

const prioridades = [
    'baixa',
    'media',
    'alta',
    'urgente'
];

const Denuncia = {
    listar() {
        return db.prepare(`
            SELECT *
            FROM denuncias
            ORDER BY created_at DESC
        `).all();
    },

    buscarPorId(id) {
        return db.prepare(`
            SELECT *
            FROM denuncias
            WHERE id = ?
        `).get(id);
    },

    criar({
        titulo,
        descricao,
        prioridade,
        usuario_id,
        localizacao_id,
        status_id
    }) {
        const prioridadeFinal = prioridade || 'media';

        if (!prioridades.includes(prioridadeFinal)) {
            throw new Error('Prioridade inválida');
        }

        const resultado = db.prepare(`
            INSERT INTO denuncias (
                titulo,
                descricao,
                prioridade,
                usuario_id,
                localizacao_id,
                status_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            titulo,
            descricao,
            prioridadeFinal,
            usuario_id,
            localizacao_id,
            status_id || null
        );

        return this.buscarPorId(resultado.lastInsertRowid);
    },

    atualizar(id, {
        titulo,
        descricao,
        prioridade,
        localizacao_id,
        status_id
    }) {
        if (
            prioridade &&
            !prioridades.includes(prioridade)
        ) {
            throw new Error('Prioridade inválida');
        }

        db.prepare(`
            UPDATE denuncias
            SET titulo = ?,
                descricao = ?,
                prioridade = ?,
                localizacao_id = ?,
                status_id = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            titulo,
            descricao,
            prioridade,
            localizacao_id,
            status_id,
            id
        );

        return this.buscarPorId(id);
    },

    excluir(id) {
        return db.prepare(`
            DELETE FROM denuncias
            WHERE id = ?
        `).run(id);
    }
};

module.exports = {
    Denuncia,
    prioridades
};