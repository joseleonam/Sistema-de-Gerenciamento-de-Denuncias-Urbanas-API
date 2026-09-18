const db = require('../database/database');

const Document = {
    listar() {
        return db.prepare(`
            SELECT *
            FROM documents
            ORDER BY id
        `).all();
    },

    buscarPorId(id) {
        return db.prepare(`
            SELECT *
            FROM documents
            WHERE id = ?
        `).get(id);
    },

    listarPorDenuncia(denuncia_id) {
        return db.prepare(`
            SELECT *
            FROM documents
            WHERE denuncia_id = ?
        `).all(denuncia_id);
    },

    criar(dados) {
        const resultado = db.prepare(`
            INSERT INTO documents (
                original_filename,
                content_type,
                extension,
                size_bytes,
                denuncia_id
            )
            VALUES (?, ?, ?, ?, ?)
        `).run(
            dados.original_filename,
            dados.content_type,
            dados.extension,
            dados.size_bytes,
            dados.denuncia_id || null
        );

        return this.buscarPorId(resultado.lastInsertRowid);
    },

    excluir(id) {
        return db.prepare(`
            DELETE FROM documents
            WHERE id = ?
        `).run(id);
    }
};

module.exports = Document;