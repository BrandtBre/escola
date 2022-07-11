const controller = require('../controllers/notasController');

module.exports = (app) => {
    app.get('/notas', controller.getAllNotas)
    app.get('/notas/:id', controller.getNotaById)
    app.post('/notas', controller.persistirNota)
    app.delete('/notas/:id', controller.excluirNota)
    app.post('/notas/media', controller.mediaAluno)
    app.post('/notas/media/todos', controller.mediaAllAlunos)
};