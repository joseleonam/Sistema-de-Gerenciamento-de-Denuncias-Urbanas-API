const db = require('../database/database');

const Categoria = {
    listar() {
        return db.prepare(`
            SELECT *
            FROM categorias
            ORDER BY id
        `).all();
    },

    buscarPorId(id) {
        return db.prepare(`
            SELECT *
            FROM categorias
            WHERE id = ?
        `).get(id);
    },

    criar(dados) {
        const resultado = db.prepare(`
            INSERT INTO categorias (
                nome,
                descricao
            )
            VALUES (?, ?)
        `).run(
            dados.nome,
            dados.descricao || null
        );

        return this.buscarPorId(resultado.lastInsertRowid);
    },

    atualizar(id, dados) {
        db.prepare(`
            UPDATE categorias
            SET nome = ?,
                descricao = ?,
                ativa = ?
            WHERE id = ?
        `).run(
            dados.nome,
            dados.descricao || null,
            dados.ativa
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