const express = require('express');
const db = require('./database/database');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Gerenciamento de Denúncias Urbanas funcionando!'
    });
});

app.use('/usuarios', usuarioRoutes);

module.exports = app;