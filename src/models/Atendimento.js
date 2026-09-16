const db = require('../database/database');

const Atendimento = {
    listar() {
        return db.prepare(`
            SELECT *
            FROM atendimentos
        `).all();
    },

    buscarPorId(id) {
        return db.prepare(`
            SELECT *
            FROM atendimentos
            WHERE id = ?
        `).get(id);
    },

    listarPorDenuncia(denunciaId) {
        return db.prepare(`
            SELECT *
            FROM atendimentos
            WHERE denuncia_id = ?
        `).all(denunciaId);
    },

    criar({
        orgao_responsavel,
        responsavel_nome,
        observacao,
        data_inicio,
        data_conclusao,
        custo_estimado,
        denuncia_id
    }) {
        const resultado = db.prepare(`
            INSERT INTO atendimentos (
                orgao_responsavel,
                responsavel_nome,
                observacao,
                data_inicio,
                data_conclusao,
                custo_estimado,
                denuncia_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            orgao_responsavel,
            responsavel_nome || null,
            observacao || null,
            data_inicio || new Date().toISOString(),
            data_conclusao || null,
            custo_estimado || null,
            denuncia_id
        );

        return this.buscarPorId(resultado.lastInsertRowid);
    },

    excluir(id) {
        return db.prepare(`
            DELETE FROM atendimentos
            WHERE id = ?
        `).run(id);
    }
};

module.exports = Atendimento;