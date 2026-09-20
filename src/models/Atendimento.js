const db = require('../database/database');


const Atendimento = {

    // ==========================
    // LISTAR
    // ==========================

    listar() {

        return db.prepare(`
            SELECT *
            FROM atendimentos
            ORDER BY data_inicio DESC
        `).all();

    },


    // ==========================
    // BUSCAR POR ID
    // ==========================

    buscarPorId(id) {

        return db.prepare(`
            SELECT *
            FROM atendimentos
            WHERE id = ?
        `).get(id);

    },


    // ==========================
    // LISTAR POR DENÚNCIA
    // ==========================

    listarPorDenuncia(denunciaId) {

        return db.prepare(`
            SELECT *
            FROM atendimentos
            WHERE denuncia_id = ?
            ORDER BY data_inicio DESC
        `).all(denunciaId);

    },


    // ==========================
    // CRIAR
    // ==========================

    criar(dados) {

        // ==========================
        // CRIA ATENDIMENTO
        // ==========================

        const resultado = db.prepare(`
            INSERT INTO atendimentos (
                denuncia_id,
                orgao_responsavel,
                responsavel_nome,
                observacao,
                data_inicio,
                data_conclusao,
                custo_estimado
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            dados.denuncia_id,
            dados.orgao_responsavel,
            dados.responsavel_nome || null,
            dados.observacao || null,
            dados.data_inicio || new Date().toISOString(),
            dados.data_conclusao || null,
            dados.custo_estimado || null
        );


        const atendimento = this.buscarPorId(resultado.lastInsertRowid);


        return atendimento;

    },


    // ==========================
    // ATUALIZAR
    // ==========================

    atualizar(id, dados) {

        const atendimento = this.buscarPorId(id);
        

        if (!atendimento) {
            throw new Error('Atendimento não encontrado');
        }


        // ==========================
        // ATUALIZA ATENDIMENTO
        // ==========================

        db.prepare(`
            UPDATE atendimentos
            SET orgao_responsavel = ?,
                responsavel_nome = ?,
                observacao = ?,
                data_conclusao = ?,
                custo_estimado = ?
            WHERE id = ?
        `).run(
            dados.orgao_responsavel || atendimento.orgao_responsavel,
            dados.responsavel_nome || atendimento.responsavel_nome,
            dados.observacao || atendimento.observacao,
            dados.data_conclusao !== undefined && 
            dados.data_conclusao !== null 
            ? new Date().toISOString() 
            : atendimento.data_conclusao,
            dados.custo_estimado || atendimento.custo_estimado,
            id
        );


        return this.buscarPorId(id);

    },


    // ==========================
    // EXCLUIR
    // ==========================

    excluir(id) {

        return db.prepare(`
            DELETE FROM atendimentos
            WHERE id = ?
        `).run(id);

    }

};


module.exports = Atendimento;