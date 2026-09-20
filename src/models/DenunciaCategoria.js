const db = require('../database/database');

const DenunciaCategoria = {

    // ==========================
    // ADICIONAR RELAÇÃO
    // ==========================

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


    // ==========================
    // LISTAR CATEGORIAS DE UMA DENÚNCIA
    // ==========================

    listarCategoriasPorDenuncia(denuncia_id) {

        return db.prepare(`
            SELECT c.*
            FROM categorias c
            INNER JOIN denuncia_categoria dc
                ON dc.categoria_id = c.id
            WHERE dc.denuncia_id = ?
            ORDER BY c.id
        `).all(denuncia_id);

    },


    // ==========================
    // LISTAR DENÚNCIAS DE UMA CATEGORIA
    // ==========================

    listarDenunciasPorCategoria(categoria_id) {

        return db.prepare(`
            SELECT d.*
            FROM denuncias d
            INNER JOIN denuncia_categoria dc
                ON dc.denuncia_id = d.id
            WHERE dc.categoria_id = ?
            ORDER BY d.created_at DESC
        `).all(categoria_id);

    },


    // ==========================
    // REMOVER UMA RELAÇÃO
    // ==========================

    remover(denuncia_id, categoria_id) {

        return db.prepare(`
            DELETE FROM denuncia_categoria
            WHERE denuncia_id = ?
            AND categoria_id = ?
        `).run(
            denuncia_id,
            categoria_id
        );

    },


    // ==========================
    // REMOVER TODAS AS CATEGORIAS
    // DE UMA DENÚNCIA
    // ==========================

    removerPorDenuncia(denuncia_id) {

        return db.prepare(`
            DELETE FROM denuncia_categoria
            WHERE denuncia_id = ?
        `).run(denuncia_id);

    }

};

module.exports = DenunciaCategoria;