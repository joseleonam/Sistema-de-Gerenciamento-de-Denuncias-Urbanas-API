const express = require('express');
const db = require('../database/database');

const router = express.Router();

router.get('/', (req, res) => {
    const usuarios = db
        .prepare(`
            SELECT id, nome, email, telefone
            FROM usuarios
        `)
        .all();

    res.status(200).json(usuarios);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;

    const usuario = db
        .prepare(`
            SELECT id, nome, email, telefone
            FROM usuarios
            WHERE id = ?
        `)
        .get(id);

    if (!usuario) {
        return res.status(404).json({
            erro: 'Usuário não encontrado'
        });
    }

    res.status(200).json(usuario);
});

router.post('/', (req, res) => {
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            erro: 'Nome, email e senha são obrigatórios'
        });
    }

    try {
        const resultado = db
            .prepare(`
                INSERT INTO usuarios (nome, email, senha, telefone)
                VALUES (?, ?, ?, ?)
            `)
            .run(nome, email, senha, telefone || null);

        const usuario = db
            .prepare(`
                SELECT id, nome, email, telefone
                FROM usuarios
                WHERE id = ?
            `)
            .get(resultado.lastInsertRowid);

        res.status(201).json(usuario);

    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({
                erro: 'Este email já está cadastrado'
            });
        }

        res.status(500).json({
            erro: 'Erro ao cadastrar usuário'
        });
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            erro: 'Nome, email e senha são obrigatórios'
        });
    }

    const usuarioExistente = db
        .prepare('SELECT id FROM usuarios WHERE id = ?')
        .get(id);

    if (!usuarioExistente) {
        return res.status(404).json({
            erro: 'Usuário não encontrado'
        });
    }

    try {
        db.prepare(`
            UPDATE usuarios
            SET nome = ?, email = ?, senha = ?, telefone = ?
            WHERE id = ?
        `).run(nome, email, senha, telefone || null, id);

        const usuarioAtualizado = db
            .prepare(`
                SELECT id, nome, email, telefone
                FROM usuarios
                WHERE id = ?
            `)
            .get(id);

        res.status(200).json(usuarioAtualizado);

    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({
                erro: 'Este email já está cadastrado'
            });
        }

        res.status(500).json({
            erro: 'Erro ao atualizar usuário'
        });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const resultado = db
        .prepare('DELETE FROM usuarios WHERE id = ?')
        .run(id);

    if (resultado.changes === 0) {
        return res.status(404).json({
            erro: 'Usuário não encontrado'
        });
    }

    res.status(200).json({
        mensagem: 'Usuário excluído com sucesso'
    });
});

module.exports = router;