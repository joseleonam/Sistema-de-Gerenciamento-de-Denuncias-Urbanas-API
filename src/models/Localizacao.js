const db = require('../database/database');

const Localizacao = {
    listar() {
        return db.prepare(`
            SELECT *
            FROM localizacoes
            ORDER BY id
        `).all();
    },

    buscarPorId(id) {
        return db.prepare(`
            SELECT *
            FROM localizacoes
            WHERE id = ?
        `).get(id);
    },

    criar(dados) {
        const resultado = db.prepare(`
            INSERT INTO localizacoes (
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
                cep,
                latitude,
                longitude
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            dados.logradouro,
            dados.numero || null,
            dados.complemento || null,
            dados.bairro,
            dados.cidade,
            dados.estado,
            dados.cep || null,
            dados.latitude || null,
            dados.longitude || null
        );

        return this.buscarPorId(resultado.lastInsertRowid);
    },

    atualizar(id, dados) {
        db.prepare(`
            UPDATE localizacoes
            SET logradouro = ?,
                numero = ?,
                complemento = ?,
                bairro = ?,
                cidade = ?,
                estado = ?,
                cep = ?,
                latitude = ?,
                longitude = ?
            WHERE id = ?
        `).run(
            dados.logradouro,
            dados.numero || null,
            dados.complemento || null,
            dados.bairro,
            dados.cidade,
            dados.estado,
            dados.cep || null,
            dados.latitude || null,
            dados.longitude || null,
            id
        );

        return this.buscarPorId(id);
    },

    excluir(id) {
        return db.prepare(`
            DELETE FROM localizacoes
            WHERE id = ?
        `).run(id);
    }
};

module.exports = Localizacao;