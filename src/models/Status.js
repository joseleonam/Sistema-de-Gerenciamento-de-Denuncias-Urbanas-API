const db = require('../database/database');

const situacoes = [
    'aberto',
    'em_analise',
    'em_andamento',
    'resolvido',
    'arquivado'
];

const Status = {
    listar() {
        return db.prepare(`
            SELECT *
            FROM status
        `).all();
    },

    buscarPorId(id) {
        return db.prepare(`
            SELECT *
            FROM status
            WHERE id = ?
        `).get(id);
    },

    criar({ situacao, descricao }) {
        if (!situacoes.includes(situacao)) {
            throw new Error('Situação inválida');
        }

        const resultado = db.prepare(`
            INSERT INTO status (situacao, descricao)
            VALUES (?, ?)
        `).run(
            situacao,
            descricao || null
        );

        return this.buscarPorId(resultado.lastInsertRowid);
    },

    atualizar(id, { situacao, descricao }) {
        if (situacao && !situacoes.includes(situacao)) {
            throw new Error('Situação inválida');
        }

        db.prepare(`
            UPDATE status
            SET situacao = ?,
                descricao = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            situacao,
            descricao || null,
            id
        );

        return this.buscarPorId(id);
    },

    excluir(id) {
        return db.prepare(`
            DELETE FROM status
            WHERE id = ?
        `).run(id);
    }
};

module.exports = {
    Status,
    situacoes
};