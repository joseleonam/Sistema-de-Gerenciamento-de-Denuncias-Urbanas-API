const express = require('express');

const { Denuncia, prioridades } = require('../models/Denuncia');
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');

const router = express.Router();


// GET /denuncias
router.get('/', (req, res) => {
    try {
        const denuncias = Denuncia.listar();

        res.status(200).json(denuncias);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao listar denúncias'
        });
    }
});


// GET /denuncias/:id
router.get('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const denuncia = Denuncia.listarComRelacionamentos(id);

        if (!denuncia) {
            return res.status(404).json({
                erro: 'Denúncia não encontrada'
            });
        }

        res.status(200).json(denuncia);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar denúncia'
        });
    }
});


// POST /denuncias
router.post('/', (req, res) => {
    try {

        const {
            titulo,
            descricao,
            prioridade,
            usuario_id,
            localizacao,
            categoria_ids
        } = req.body;


        // ==========================
        // VALIDAÇÕES
        // ==========================

        if (
            !titulo ||
            !descricao ||
            !usuario_id ||
            !localizacao
        ) {
            return res.status(400).json({
                erro: 'Título, descrição, usuário_id e localização são obrigatórios'
            });
        }


        if (titulo.length < 5) {
            return res.status(400).json({
                erro: 'Título deve possuir pelo menos 5 caracteres'
            });
        }


        if (descricao.length < 10) {
            return res.status(400).json({
                erro: 'Descrição deve possuir pelo menos 10 caracteres'
            });
        }


        // ==========================
        // PRIORIDADE
        // ==========================

        if (
            prioridade &&
            !prioridades.includes(prioridade)
        ) {
            return res.status(400).json({
                erro: 'Prioridade inválida',
                valores_permitidos: prioridades
            });
        }


        // ==========================
        // USUÁRIO
        // ==========================

        const usuario = Usuario.buscarPorId(
            Number(usuario_id)
        );

        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }


        // ==========================
        // LOCALIZAÇÃO
        // ==========================

        if (
            !localizacao.logradouro ||
            !localizacao.bairro ||
            !localizacao.cidade ||
            !localizacao.estado
        ) {
            return res.status(400).json({
                erro: 'Localização inválida',
                mensagem: 'Logradouro, bairro, cidade e estado são obrigatórios',
                exemplo: {
                    localizacao: {
                        logradouro: 'Rua Principal',
                        numero: '200',
                        bairro: 'Centro',
                        cidade: 'Quixadá',
                        estado: 'CE'
                    }
                }
            });
        }


        // ==========================
        // CATEGORIAS
        // ==========================

        if (
            categoria_ids !== undefined &&
            !Array.isArray(categoria_ids)
        ) {
            return res.status(400).json({
                erro: 'categoria_ids deve ser um array'
            });
        }


        const categorias = categoria_ids || [];


        for (const categoriaId of categorias) {

            const categoria = Categoria.buscarPorId(
                Number(categoriaId)
            );

            if (!categoria) {
                return res.status(404).json({
                    erro: `Categoria ${categoriaId} não encontrada`
                });
            }
        }


        // ==========================
        // CRIA DENÚNCIA
        // ==========================

        const denuncia = Denuncia.criar({

            titulo,

            descricao,

            prioridade: prioridade || 'media',

            usuario_id: Number(usuario_id),

            localizacao,

            categoria_ids: categorias.map(Number)
        });


        res.status(201).json(denuncia);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao cadastrar denúncia'
        });
    }
});


// PUT /denuncias/:id
router.put('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }


        // Verifica denúncia
        const denunciaExistente = Denuncia.buscarPorId(id);

        if (!denunciaExistente) {
            return res.status(404).json({
                erro: 'Denúncia não encontrada'
            });
        }


        const {
            titulo,
            descricao,
            prioridade,
            localizacao_id,
            categoria_ids
        } = req.body;


        // ==========================
        // VALIDAÇÕES
        // ==========================

        if (!titulo || !descricao) {
            return res.status(400).json({
                erro: 'Título e descrição são obrigatórios'
            });
        }


        if (titulo.length < 5) {
            return res.status(400).json({
                erro: 'Título deve possuir pelo menos 5 caracteres'
            });
        }


        if (descricao.length < 10) {
            return res.status(400).json({
                erro: 'Descrição deve possuir pelo menos 10 caracteres'
            });
        }


        if (prioridade && !prioridades.includes(prioridade)) {
            return res.status(400).json({
                erro: 'Prioridade inválida',
                valores_permitidos: prioridades
            });
        }


        // ==========================
        // LOCALIZAÇÃO
        // ==========================

        if (localizacao_id !== undefined) {

            const localizacao = Localizacao.buscarPorId(
                Number(localizacao_id)
            );

            if (!localizacao) {
                return res.status(404).json({
                    erro: 'Localização não encontrada'
                });
            }
        }


        // ==========================
        // CATEGORIAS
        // ==========================

        if (categoria_ids !== undefined) {

            if (!Array.isArray(categoria_ids)) {
                return res.status(400).json({
                    erro: 'categoria_ids deve ser um array'
                });
            }


            for (const categoriaId of categoria_ids) {

                const categoria = Categoria.buscarPorId(
                    Number(categoriaId)
                );

                if (!categoria) {
                    return res.status(404).json({
                        erro: `Categoria ${categoriaId} não encontrada`
                    });
                }
            }
        }


        // ==========================
        // ATUALIZA
        // ==========================

        const denuncia = Denuncia.atualizar(id, {
            titulo,
            descricao,
            prioridade: prioridade || denunciaExistente.prioridade,
            localizacao_id:
                localizacao_id !== undefined
                    ? Number(localizacao_id)
                    : denunciaExistente.localizacao_id,
            categoria_ids:
                categoria_ids !== undefined
                    ? categoria_ids.map(Number)
                    : undefined
        });


        res.status(200).json(denuncia);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao atualizar denúncia'
        });
    }
});


// DELETE /denuncias/:id
router.delete('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }


        const denuncia = Denuncia.buscarPorId(id);

        if (!denuncia) {
            return res.status(404).json({
                erro: 'Denúncia não encontrada'
            });
        }


        Denuncia.excluir(id);


        res.status(200).json({
            mensagem: 'Denúncia excluída com sucesso'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao excluir denúncia'
        });
    }
});


module.exports = router;