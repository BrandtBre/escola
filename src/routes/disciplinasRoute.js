const controller = require('../controllers/disciplinasController');

module.exports = (app) => {
    app.get('/disciplinas', controller.getAllDisciplinas)
    app.get('/disciplinas/:id', controller.getDisciplinaById)
    app.post('/disciplinas', controller.persistirDisciplina)
    app.delete('/disciplinas/:id', controller.excluirDisciplina)
};