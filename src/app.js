const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Gerenciamento de Denúncias Urbanas funcionando!'
    });
});

module.exports = app;