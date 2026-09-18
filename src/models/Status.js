const db = require('../database/database');

const situacoes = [
    'aberto',
    'em_analise',
    'em_andamento',
    'resolvido',
    'arquivado'
];

const Status = {

    listar() {
        return db.prepare(`
            SELECT *
            FROM status
            ORDER BY id
        `).all();
    },


    buscarPorId(id) {
        return db.prepare(`
            SELECT *
            FROM status
            WHERE id = ?
        `).get(id);
    },


    criar(dados) {
        const resultado = db.prepare(`
            INSERT INTO status (
                situacao,
                descricao
            )
            VALUES (?, ?)
        `).run(
            dados.situacao || 'aberto',
            dados.descricao || null
        );

        return this.buscarPorId(resultado.lastInsertRowid);
    },


    atualizar(id, dados) {
        db.prepare(`
            UPDATE status
            SET situacao = ?,
                descricao = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            dados.situacao,
            dados.descricao || null,
            id
        );

        return this.buscarPorId(id);
    },


    excluir(id) {
        return db.prepare(`
            DELETE FROM status
            WHERE id = ?
        `).run(id);
    }
};


module.exports = {
    Status,
    situacoes
};