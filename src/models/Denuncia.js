const db = require('../database/database');

const Localizacao = require('./Localizacao');
const Usuario = require('./Usuario');
const { Status } = require('./Status');
const DenunciaCategoria = require('./DenunciaCategoria');
const Atendimento = require('./Atendimento');


const prioridades = [
    'baixa',
    'media',
    'alta',
    'urgente'
];


const Denuncia = {

    // ==========================
    // LISTAR
    // ==========================

    listar() {

        return db.prepare(`
            SELECT *
            FROM denuncias
            ORDER BY created_at DESC
        `).all();

    },


    // ==========================
    // BUSCAR POR ID
    // ==========================

    buscarPorId(id) {

        return db.prepare(`
            SELECT *
            FROM denuncias
            WHERE id = ?
        `).get(id);

    },


    // ==========================
    // CRIAR
    // ==========================

    criar(dados) {

        // --------------------------
        // Cria localização
        // --------------------------

        const localizacao = Localizacao.criar(
            dados.localizacao
        );

        const localizacaoId = localizacao.id;


        // --------------------------
        // Cria status
        // --------------------------

        const status = Status.criar({
            situacao: 'aberto',
            descricao: 'Denúncia registrada'
        });


        // --------------------------
        // Cria denúncia
        // --------------------------

        const resultado = db.prepare(`
            INSERT INTO denuncias (
                titulo,
                descricao,
                prioridade,
                usuario_id,
                localizacao_id,
                status_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            dados.titulo,
            dados.descricao,
            dados.prioridade || 'media',
            dados.usuario_id,
            localizacaoId,
            status.id
        );


        const denunciaId = resultado.lastInsertRowid;


        // --------------------------
        // Relaciona categorias
        // --------------------------

        if (dados.categoria_ids) {

            for (const categoriaId of dados.categoria_ids) {

                DenunciaCategoria.adicionar(
                    denunciaId,
                    categoriaId
                );

            }

        }

        // --------------------------
        // Retorna completa
        // --------------------------

        return this.listarComRelacionamentos(denunciaId);

    },


    // ==========================
    // ATUALIZAR
    // ==========================

    atualizar(id, dados) {

        const denuncia = this.buscarPorId(id);

        if (!denuncia) {
            return null;
        }


        // --------------------------
        // Atualiza denúncia
        // --------------------------

        db.prepare(`
            UPDATE denuncias
            SET titulo = ?,
                descricao = ?,
                prioridade = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            dados.titulo,
            dados.descricao,
            dados.prioridade,
            id
        );


        // --------------------------
        // Atualiza localização
        // --------------------------

        if (dados.localizacao) {

            Localizacao.atualizar(
                denuncia.localizacao_id,
                dados.localizacao
            );

        }


        // --------------------------
        // Atualiza categorias
        // --------------------------

        if (dados.categoria_ids !== undefined) {

            DenunciaCategoria.removerPorDenuncia(id);


            for (const categoriaId of dados.categoria_ids) {

                DenunciaCategoria.adicionar(id,categoriaId);

            }

        }

        // --------------------------
        // Retorna completa
        // --------------------------

        return this.listarComRelacionamentos(id);

    },


    // ==========================
    // EXCLUIR
    // ==========================

    excluir(id) {

        const denuncia = this.buscarPorId(id);

        if (!denuncia) {
            return null;
        }


        // --------------------------
        // Remove categorias
        // --------------------------

        DenunciaCategoria.excluirPorDenuncia(id);


        // --------------------------
        // Remove denúncia
        // --------------------------

        const resultado = db.prepare(`
            DELETE FROM denuncias
            WHERE id = ?
        `).run(id);


        // --------------------------
        // Remove localização
        // --------------------------

        if (denuncia.localizacao_id) {

            Localizacao.excluir(
                denuncia.localizacao_id
            );

        }


        return resultado;

    },


    // ==========================
    // BUSCAR COMPLETA
    // ==========================

    listarComRelacionamentos(id) {

        const denuncia = this.buscarPorId(id);

        if (!denuncia) {
            return null;
        }


        // --------------------------
        // Usuário
        // --------------------------

        const usuario = Usuario.buscarPorId(
            denuncia.usuario_id
        );


        // --------------------------
        // Localização
        // --------------------------

        const localizacao = Localizacao.buscarPorId(
            denuncia.localizacao_id
        );


        // --------------------------
        // Status
        // --------------------------

        const status = denuncia.status_id
            ? Status.buscarPorId(denuncia.status_id)
            : null;


        // --------------------------
        // Categorias
        // --------------------------

        const categorias =
            DenunciaCategoria.listarCategoriasPorDenuncia(id);

        // --------------------------
        // Atendimentos
        // --------------------------
        const atendimentos = Atendimento.listarPorDenuncia(id);


        return {
            ...denuncia,
            usuario,
            localizacao,
            status,
            categorias,
            atendimentos
        };

    }

};


module.exports = {
    Denuncia,
    prioridades
};