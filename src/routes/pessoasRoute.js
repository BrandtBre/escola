const controller = require('../controllers/pessoasController');

module.exports = (app) => {
    app.get('/pessoas', controller.getAllPessoas)
    app.get('/pessoas/:id', controller.getPessoaById)
    app.post('/pessoas', controller.persistirPessoa)
    app.delete('/pessoas/:id', controller.excluirPessoa)
};