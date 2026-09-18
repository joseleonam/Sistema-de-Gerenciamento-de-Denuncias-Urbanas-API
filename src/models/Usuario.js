const db = require('../database/database');

const Usuario = {
    listar() {
        return db.prepare(`
            SELECT *
            FROM usuarios
            ORDER BY id
        `).all();
    },

    buscarPorId(id) {
        return db.prepare(`
            SELECT *
            FROM usuarios
            WHERE id = ?
        `).get(id);
    },

    criar(dados) {
        const resultado = db.prepare(`
            INSERT INTO usuarios (
                nome,
                email,
                cpf,
                telefone
            )
            VALUES (?, ?, ?, ?)
        `).run(
            dados.nome,
            dados.email,
            dados.cpf,
            dados.telefone || null
        );

        return this.buscarPorId(resultado.lastInsertRowid);
    },

    atualizar(id, dados) {
        db.prepare(`
            UPDATE usuarios
            SET nome = ?,
                email = ?,
                telefone = ?,
                ativo = ?
            WHERE id = ?
        `).run(
            dados.nome,
            dados.email,
            dados.telefone || null,
            dados.ativo,
            id
        );

        return this.buscarPorId(id);
    },

    excluir(id) {
        return db.prepare(`
            DELETE FROM usuarios
            WHERE id = ?
        `).run(id);
    }
};

module.exports = Usuario;