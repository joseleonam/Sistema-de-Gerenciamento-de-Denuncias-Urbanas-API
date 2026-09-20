const express = require('express');

const Atendimento = require('../models/Atendimento');
const { Denuncia } = require('../models/Denuncia');
const { Status } = require('../models/Status');

const router = express.Router();


// ==========================
// GET /atendimentos
// ==========================

router.get('/', (req, res) => {

    try {

        const atendimentos = Atendimento.listar();

        res.status(200).json(atendimentos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao listar atendimentos'
        });

    }

});


// ==========================
// GET /atendimentos/denuncia/:id
// ==========================

router.get('/denuncia/:id', (req, res) => {

    try {

        const denunciaId = Number(req.params.id);


        if (isNaN(denunciaId)) {

            return res.status(400).json({
                erro: 'ID da denúncia inválido'
            });

        }


        const denuncia = Denuncia.buscarPorId(denunciaId);


        if (!denuncia) {

            return res.status(404).json({
                erro: 'Denúncia não encontrada'
            });

        }


        const atendimentos = Atendimento.listarPorDenuncia(denunciaId);


        res.status(200).json(atendimentos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao listar atendimentos da denúncia'
        });

    }

});


// ==========================
// GET /atendimentos/:id
// ==========================

router.get('/:id', (req, res) => {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({
                erro: 'ID inválido'
            });

        }


        const atendimento = Atendimento.buscarPorId(id);


        if (!atendimento) {

            return res.status(404).json({
                erro: 'Atendimento não encontrado'
            });

        }


        res.status(200).json(atendimento);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar atendimento'
        });

    }

});


// ==========================
// POST /atendimentos
// ==========================

router.post('/', (req, res) => {

    try {

        const {
            denuncia_id,
            orgao_responsavel,
            responsavel_nome,
            observacao,
            data_inicio,
            data_conclusao,
            custo_estimado
        } = req.body;


        // ==========================
        // VALIDAÇÕES
        // ==========================

        if (!denuncia_id || !orgao_responsavel) {

            return res.status(400).json({
                erro: 'denuncia_id e orgao_responsavel são obrigatórios'
            });

        }


        // ==========================
        // VERIFICA DENÚNCIA
        // ==========================

        const denuncia = Denuncia.buscarPorId(Number(denuncia_id));


        if (!denuncia) {

            return res.status(404).json({
                erro: 'Denúncia não encontrada'
            });

        }


        // ==========================
        // CUSTO
        // ==========================

        if (
            custo_estimado !== undefined &&
            custo_estimado !== null &&
            Number(custo_estimado) < 0
        ) {

            return res.status(400).json({
                erro: 'O custo estimado não pode ser negativo'
            });

        }


        // ==========================
        // CRIA
        // ==========================

        const atendimento = Atendimento.criar({

                denuncia_id: Number(denuncia_id),
                orgao_responsavel,
                responsavel_nome,
                observacao,
                data_inicio,
                data_conclusao,
                custo_estimado:
                    custo_estimado !== undefined
                        ? Number(custo_estimado)
                        : null

            });

        if (denuncia.status_id) {

            Status.atualizar(
                denuncia.status_id,
                {
                    situacao: 'em_andamento',
                    descricao: 'Atendimento iniciado'
                }
            );

        }

        res.status(201).json(atendimento);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao cadastrar atendimento'
        });

    }

});


// ==========================
// PUT /atendimentos/:id
// ==========================

router.put('/:id', (req, res) => {

    try {

        const id = Number(req.params.id);


        if (isNaN(id)) {

            return res.status(400).json({
                erro: 'ID inválido'
            });

        }

        // ==========================
        // VERIFICA ATENDIMENTO E DENÚNCIA
        // ==========================

        const atendimento = Atendimento.buscarPorId(id);

        if (!atendimento) {

            return res.status(404).json({
                erro: 'Atendimento não encontrado'
            });

        }

        const denuncia = Denuncia.buscarPorId(Number(atendimento.denuncia_id));


        if (!denuncia) {

            return res.status(404).json({
                erro: 'Denúncia não encontrada'
            });

        }


        const {
            orgao_responsavel,
            responsavel_nome,
            observacao,
            data_conclusao,
            custo_estimado
        } = req.body;


        // ==========================
        // VALIDAÇÕES
        // ==========================

        if (
            custo_estimado !== undefined &&
            custo_estimado !== null &&
            Number(custo_estimado) < 0
        ) {

            return res.status(400).json({
                erro: 'O custo estimado não pode ser negativo'
            });

        }


        const atualizado = Atendimento.atualizar(id, {

                orgao_responsavel,
                responsavel_nome,
                observacao,
                data_conclusao,
                custo_estimado:
                    custo_estimado !== undefined
                        ? Number(custo_estimado)
                        : null

            });
        
        // ==========================
        // ATUALIZA STATUS
        // ==========================
        

        if (denuncia.status_id) {

            if (data_conclusao !== null && data_conclusao !== undefined) {

                Status.atualizar(
                    denuncia.status_id,
                    {
                        situacao: 'resolvido',
                        descricao: 'Denúncia resolvida'
                    }
                );

            }

        }


        res.status(200).json(atualizado);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao atualizar atendimento'
        });

    }

});


// ==========================
// DELETE /atendimentos/:id
// ==========================

router.delete('/:id', (req, res) => {

    try {

        const id = Number(req.params.id);


        if (isNaN(id)) {

            return res.status(400).json({
                erro: 'ID inválido'
            });

        }


        const atendimento = Atendimento.buscarPorId(id);


        if (!atendimento) {

            return res.status(404).json({
                erro: 'Atendimento não encontrado'
            });

        }


        Atendimento.excluir(id);


        res.status(200).json({
            mensagem: 'Atendimento excluído com sucesso'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao excluir atendimento'
        });

    }

});


module.exports = router;