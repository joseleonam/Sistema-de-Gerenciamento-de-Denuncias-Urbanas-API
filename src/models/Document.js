const db = require('../database/database');

const Document = {
    listar() {
        return db.prepare(`
            SELECT *
            FROM documents
        `).all();
    },

    buscarPorId(id) {
        return db.prepare(`
            SELECT *
            FROM documents
            WHERE id = ?
        `).get(id);
    },

    listarPorDenuncia(denunciaId) {
        return db.prepare(`
            SELECT *
            FROM documents
            WHERE denuncia_id = ?
        `).all(denunciaId);
    },

    criar({
        original_filename,
        content_type,
        extension,
        size_bytes,
        denuncia_id
    }) {
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
            original_filename,
            content_type,
            extension,
            size_bytes,
            denuncia_id || null
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