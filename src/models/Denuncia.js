const db = require('../database/database');

const Localizacao = require('./Localizacao');
const { Status } = require('./Status');

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
        // Cria a localização
        // --------------------------

        const localizacao = Localizacao.criar(
            dados.localizacao
        );

        const localizacaoId = localizacao.id;


        // --------------------------
        // Cria o status
        // --------------------------

        const status = Status.criar({
            situacao: 'aberto',
            descricao: 'Denúncia registrada'
        });


        // --------------------------
        // Cria a denúncia
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

        if (
            dados.categoria_ids &&
            dados.categoria_ids.length > 0
        ) {

            const inserirCategoria = db.prepare(`
                INSERT INTO denuncia_categoria (
                    denuncia_id,
                    categoria_id
                )
                VALUES (?, ?)
            `);


            for (const categoriaId of dados.categoria_ids) {

                inserirCategoria.run(
                    denunciaId,
                    categoriaId
                );
            }
        }


        // --------------------------
        // Retorna completa
        // --------------------------

        return this.listarComRelacionamentos(
            denunciaId
        );
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

            db.prepare(`
                DELETE FROM denuncia_categoria
                WHERE denuncia_id = ?
            `).run(id);


            const inserirCategoria = db.prepare(`
                INSERT INTO denuncia_categoria (
                    denuncia_id,
                    categoria_id
                )
                VALUES (?, ?)
            `);


            for (const categoriaId of dados.categoria_ids) {

                inserirCategoria.run(
                    id,
                    categoriaId
                );
            }
        }


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


        // Remove categorias relacionadas
        db.prepare(`
            DELETE FROM denuncia_categoria
            WHERE denuncia_id = ?
        `).run(id);


        // Remove a denúncia
        const resultado = db.prepare(`
            DELETE FROM denuncias
            WHERE id = ?
        `).run(id);


        // Remove a localização
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

        const usuario = db.prepare(`
            SELECT id, nome, email, telefone
            FROM usuarios
            WHERE id = ?
        `).get(denuncia.usuario_id);


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

        const categorias = db.prepare(`
            SELECT c.*
            FROM categorias c
            INNER JOIN denuncia_categoria dc
                ON dc.categoria_id = c.id
            WHERE dc.denuncia_id = ?
        `).all(id);


        return {
            ...denuncia,
            usuario,
            localizacao,
            status,
            categorias
        };
    }
};


module.exports = {
    Denuncia,
    prioridades
};