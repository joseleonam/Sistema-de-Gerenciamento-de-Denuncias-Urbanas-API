const express = require('express');
const Categoria = require('../models/Categoria');

const router = express.Router();


// GET /categorias
router.get('/', (req, res) => {
    try {
        const categorias = Categoria.listar();

        res.status(200).json(categorias);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao listar categorias'
        });
    }
});


// GET /categorias/:id
router.get('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const categoria = Categoria.buscarPorId(id);

        if (!categoria) {
            return res.status(404).json({
                erro: 'Categoria não encontrada'
            });
        }

        res.status(200).json(categoria);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar categoria'
        });
    }
});


// POST /categorias
router.post('/', (req, res) => {
    try {
        const { nome, descricao } = req.body;

        if (!nome) {
            return res.status(400).json({
                erro: 'Nome é obrigatório'
            });
        }

        if (nome.length < 2) {
            return res.status(400).json({
                erro: 'Nome deve possuir pelo menos 2 caracteres'
            });
        }

        const categoria = Categoria.criar({
            nome,
            descricao
        });

        res.status(201).json(categoria);
    } catch (error) {
        console.error(error);

        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({
                erro: 'Categoria já cadastrada'
            });
        }

        res.status(500).json({
            erro: 'Erro ao cadastrar categoria'
        });
    }
});


// PUT /categorias/:id
router.put('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const categoriaExistente = Categoria.buscarPorId(id);

        if (!categoriaExistente) {
            return res.status(404).json({
                erro: 'Categoria não encontrada'
            });
        }

        const { nome, descricao, ativa } = req.body;

        if (!nome || ativa === undefined) {
            return res.status(400).json({
                erro: 'Nome e ativa são obrigatórios'
            });
        }

        const categoria = Categoria.atualizar(id, {
            nome,
            descricao,
            ativa: ativa ? 1 : 0
        });

        res.status(200).json(categoria);
    } catch (error) {
        console.error(error);

        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({
                erro: 'Já existe uma categoria com esse nome'
            });
        }

        res.status(500).json({
            erro: 'Erro ao atualizar categoria'
        });
    }
});


// DELETE /categorias/:id
router.delete('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const categoria = Categoria.buscarPorId(id);

        if (!categoria) {
            return res.status(404).json({
                erro: 'Categoria não encontrada'
            });
        }

        Categoria.excluir(id);

        res.status(200).json({
            mensagem: 'Categoria excluída com sucesso'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao excluir categoria'
        });
    }
});


module.exports = router;