const db = require('../database/database');

const Categoria = {
    listar() {
        return db.prepare(`
            SELECT id, nome, descricao, ativa
            FROM categorias
        `).all();
    },

    buscarPorId(id) {
        return db.prepare(`
            SELECT id, nome, descricao, ativa
            FROM categorias
            WHERE id = ?
        `).get(id);
    },

    criar({ nome, descricao }) {
        const resultado = db.prepare(`
            INSERT INTO categorias (nome, descricao)
            VALUES (?, ?)
        `).run(
            nome,
            descricao || null
        );

        return this.buscarPorId(resultado.lastInsertRowid);
    },

    atualizar(id, { nome, descricao, ativa }) {
        db.prepare(`
            UPDATE categorias
            SET nome = ?,
                descricao = ?,
                ativa = ?
            WHERE id = ?
        `).run(
            nome,
            descricao || null,
            ativa,
            id
        );

        return this.buscarPorId(id);
    },

    excluir(id) {
        return db.prepare(`
            DELETE FROM categorias
            WHERE id = ?
        `).run(id);
    }
};

module.exports = Categoria;