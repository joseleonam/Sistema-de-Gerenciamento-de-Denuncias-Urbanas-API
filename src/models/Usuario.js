const db = require('../database/database');

const Usuario = {
    listar() {
        return db.prepare(`
            SELECT id, nome, email, cpf, telefone, ativo, created_at
            FROM usuarios
        `).all();
    },

    buscarPorId(id) {
        return db.prepare(`
            SELECT id, nome, email, cpf, telefone, ativo, created_at
            FROM usuarios
            WHERE id = ?
        `).get(id);
    },

    criar({ nome, email, cpf, telefone }) {
        const resultado = db.prepare(`
            INSERT INTO usuarios (nome, email, cpf, telefone)
            VALUES (?, ?, ?, ?)
        `).run(nome, email, cpf, telefone || null);

        return this.buscarPorId(resultado.lastInsertRowid);
    },

    atualizar(id, { nome, email, telefone, ativo }) {
        db.prepare(`
            UPDATE usuarios
            SET nome = ?,
                email = ?,
                telefone = ?,
                ativo = ?
            WHERE id = ?
        `).run(
            nome,
            email,
            telefone || null,
            ativo,
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