const express = require('express');
const { Status, situacoes } = require('../models/Status');

const router = express.Router();


// GET /status
router.get('/', (req, res) => {
    try {
        const status = Status.listar();

        res.status(200).json(status);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao listar status'
        });
    }
});


// GET /status/:id
router.get('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const status = Status.buscarPorId(id);

        if (!status) {
            return res.status(404).json({
                erro: 'Status não encontrado'
            });
        }

        res.status(200).json(status);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar status'
        });
    }
});


// POST /status
router.post('/', (req, res) => {
    try {
        const { situacao, descricao } = req.body;

        if (!situacao) {
            return res.status(400).json({
                erro: 'Situação é obrigatória'
            });
        }

        if (!situacoes.includes(situacao)) {
            return res.status(400).json({
                erro: 'Situação inválida',
                situacoes
            });
        }

        const status = Status.criar({
            situacao,
            descricao
        });

        res.status(201).json(status);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao cadastrar status'
        });
    }
});


// PUT /status/:id
router.put('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const statusExistente = Status.buscarPorId(id);

        if (!statusExistente) {
            return res.status(404).json({
                erro: 'Status não encontrado'
            });
        }

        const { situacao, descricao } = req.body;

        if (!situacao) {
            return res.status(400).json({
                erro: 'Situação é obrigatória'
            });
        }

        if (!situacoes.includes(situacao)) {
            return res.status(400).json({
                erro: 'Situação inválida',
                situacoes
            });
        }

        const status = Status.atualizar(id, {
            situacao,
            descricao
        });

        res.status(200).json(status);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao atualizar status'
        });
    }
});


// DELETE /status/:id
router.delete('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const status = Status.buscarPorId(id);

        if (!status) {
            return res.status(404).json({
                erro: 'Status não encontrado'
            });
        }

        Status.excluir(id);

        res.status(200).json({
            mensagem: 'Status excluído com sucesso'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao excluir status'
        });
    }
});


module.exports = router;