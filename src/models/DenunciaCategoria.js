const db = require('../database/database');

const DenunciaCategoria = {
    adicionar(denuncia_id, categoria_id) {
        return db.prepare(`
            INSERT INTO denuncia_categoria (
                denuncia_id,
                categoria_id
            )
            VALUES (?, ?)
        `).run(
            denuncia_id,
            categoria_id
        );
    },

    listarPorDenuncia(denuncia_id) {
        return db.prepare(`
            SELECT c.*
            FROM categorias c
            INNER JOIN denuncia_categoria dc
                ON dc.categoria_id = c.id
            WHERE dc.denuncia_id = ?
        `).all(denuncia_id);
    },

    remover(denuncia_id, categoria_id) {
        return db.prepare(`
            DELETE FROM denuncia_categoria
            WHERE denuncia_id = ?
            AND categoria_id = ?
        `).run(
            denuncia_id,
            categoria_id
        );
    }
};

module.exports = DenunciaCategoria;