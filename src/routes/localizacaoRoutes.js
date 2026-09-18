const express = require('express');
const Localizacao = require('../models/Localizacao');

const router = express.Router();


// GET /localizacoes
router.get('/', (req, res) => {
    try {
        const localizacoes = Localizacao.listar();

        res.status(200).json(localizacoes);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao listar localizações'
        });
    }
});


// GET /localizacoes/:id
router.get('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const localizacao = Localizacao.buscarPorId(id);

        if (!localizacao) {
            return res.status(404).json({
                erro: 'Localização não encontrada'
            });
        }

        res.status(200).json(localizacao);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar localização'
        });
    }
});


// POST /localizacoes
router.post('/', (req, res) => {
    try {
        const {
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep,
            latitude,
            longitude
        } = req.body;

        if (!logradouro || !bairro || !cidade || !estado) {
            return res.status(400).json({
                erro: 'Logradouro, bairro, cidade e estado são obrigatórios'
            });
        }

        if (estado.length !== 2) {
            return res.status(400).json({
                erro: 'Estado deve possuir 2 caracteres'
            });
        }

        const localizacao = Localizacao.criar({
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep,
            latitude,
            longitude
        });

        res.status(201).json(localizacao);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao cadastrar localização'
        });
    }
});


// PUT /localizacoes/:id
router.put('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const localizacaoExistente = Localizacao.buscarPorId(id);

        if (!localizacaoExistente) {
            return res.status(404).json({
                erro: 'Localização não encontrada'
            });
        }

        const {
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep,
            latitude,
            longitude
        } = req.body;

        if (!logradouro || !bairro || !cidade || !estado) {
            return res.status(400).json({
                erro: 'Logradouro, bairro, cidade e estado são obrigatórios'
            });
        }

        const localizacao = Localizacao.atualizar(id, {
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep,
            latitude,
            longitude
        });

        res.status(200).json(localizacao);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao atualizar localização'
        });
    }
});


// DELETE /localizacoes/:id
router.delete('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const localizacao = Localizacao.buscarPorId(id);

        if (!localizacao) {
            return res.status(404).json({
                erro: 'Localização não encontrada'
            });
        }

        Localizacao.excluir(id);

        res.status(200).json({
            mensagem: 'Localização excluída com sucesso'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao excluir localização'
        });
    }
});


module.exports = router;