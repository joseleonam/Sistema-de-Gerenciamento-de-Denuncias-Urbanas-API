const express = require('express');
const Usuario = require('../models/Usuario');

const router = express.Router();


// GET /usuarios
router.get('/', (req, res) => {
    try {
        const usuarios = Usuario.listar();

        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao listar usuários'
        });
    }
});


// GET /usuarios/:id
router.get('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const usuario = Usuario.buscarPorId(id);

        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao buscar usuário'
        });
    }
});


// POST /usuarios
router.post('/', (req, res) => {
    try {
        const {
            nome,
            email,
            cpf,
            telefone
        } = req.body;

        // Validação básica
        if (!nome || !email || !cpf) {
            return res.status(400).json({
                erro: 'Nome, email e CPF são obrigatórios'
            });
        }

        if (nome.length < 2) {
            return res.status(400).json({
                erro: 'Nome deve possuir pelo menos 2 caracteres'
            });
        }

        if (!email.includes('@')) {
            return res.status(400).json({
                erro: 'Email inválido'
            });
        }

        const usuario = Usuario.criar({
            nome,
            email,
            cpf,
            telefone
        });

        res.status(201).json(usuario);
    } catch (error) {

        // Email ou CPF duplicado
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({
                erro: 'Email ou CPF já cadastrado'
            });
        }

        res.status(500).json({
            erro: 'Erro ao cadastrar usuário'
        });
    }
});


// PUT /usuarios/:id
router.put('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const usuarioExistente = Usuario.buscarPorId(id);

        if (!usuarioExistente) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        const {
            nome,
            email,
            telefone,
            ativo
        } = req.body;

        if (!nome || !email || ativo === undefined) {
            return res.status(400).json({
                erro: 'Nome, email e ativo são obrigatórios'
            });
        }

        if (nome.length < 2) {
            return res.status(400).json({
                erro: 'Nome deve possuir pelo menos 2 caracteres'
            });
        }

        if (!email.includes('@')) {
            return res.status(400).json({
                erro: 'Email inválido'
            });
        }

        const usuario = Usuario.atualizar(id, {
            nome,
            email,
            telefone,
            ativo: ativo ? 1 : 0
        });

        res.status(200).json(usuario);
    } catch (error) {

        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({
                erro: 'Email já cadastrado'
            });
        }

        res.status(500).json({
            erro: 'Erro ao atualizar usuário'
        });
    }
});


// DELETE /usuarios/:id
router.delete('/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido'
            });
        }

        const usuario = Usuario.buscarPorId(id);

        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        Usuario.excluir(id);

        res.status(200).json({
            mensagem: 'Usuário excluído com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao excluir usuário'
        });
    }
});


module.exports = router;