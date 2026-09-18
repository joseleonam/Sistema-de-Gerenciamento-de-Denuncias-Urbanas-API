const db = require('../database/database');

const Atendimento = {
    listar() {
        return db.prepare(`
            SELECT *
            FROM atendimentos
            ORDER BY id
        `).all();
    },

    buscarPorId(id) {
        return db.prepare(`
            SELECT *
            FROM atendimentos
            WHERE id = ?
        `).get(id);
    },

    listarPorDenuncia(denuncia_id) {
        return db.prepare(`
            SELECT *
            FROM atendimentos
            WHERE denuncia_id = ?
        `).all(denuncia_id);
    },

    criar(dados) {
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
            dados.orgao_responsavel,
            dados.responsavel_nome || null,
            dados.observacao || null,
            dados.data_inicio || new Date().toISOString(),
            dados.data_conclusao || null,
            dados.custo_estimado || null,
            dados.denuncia_id
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