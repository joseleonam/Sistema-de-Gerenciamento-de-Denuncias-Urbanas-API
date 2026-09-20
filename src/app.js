const express = require('express');

const usuarioRoutes = require('./routes/usuarioRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const localizacaoRoutes = require('./routes/localizacaoRoutes');
const statusRoutes = require('./routes/statusRoutes');
const denunciaRoutes = require('./routes/denunciaRoutes');
const atendimentoRoutes = require('./routes/atendimentoRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Gerenciamento de Denúncias Urbanas funcionando!'
    });
});

app.use('/usuarios', usuarioRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/localizacoes', localizacaoRoutes);
app.use('/status', statusRoutes);
app.use('/denuncias', denunciaRoutes);
app.use('/atendimentos', atendimentoRoutes);

module.exports = app;
