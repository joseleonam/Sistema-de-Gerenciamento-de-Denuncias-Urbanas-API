const db = require('../database/database');

const Localizacao = {
    listar() {
        return db.prepare(`
            SELECT *
            FROM localizacoes
        `).all();
    },

    buscarPorId(id) {
        return db.prepare(`
            SELECT *
            FROM localizacoes
            WHERE id = ?
        `).get(id);
    },

    criar({
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        latitude,
        longitude
    }) {
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
            logradouro,
            numero || null,
            complemento || null,
            bairro,
            cidade,
            estado,
            cep || null,
            latitude || null,
            longitude || null
        );

        return this.buscarPorId(resultado.lastInsertRowid);
    },

    atualizar(id, {
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        latitude,
        longitude
    }) {
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
            logradouro,
            numero || null,
            complemento || null,
            bairro,
            cidade,
            estado,
            cep || null,
            latitude || null,
            longitude || null,
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