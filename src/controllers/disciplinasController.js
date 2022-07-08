const service = require('../services/disciplinasService');

const getAll = async (req, res) => {
    try {
        const response = await service.getAllDisciplinas();
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

const getById = async (req, res) => {
    try {
        const response = await service.getDisciplinaById(req.params);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

const persistir = async (req, res) => {
    try {
        const response = await service.persistirDisciplina(req.body);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

const excluir = async (req, res) => {
    try {
        let deletado = await service.excluirDisciplina(req.params);
        let response = deletado 
            ? `Registro ${req.params.id} deletado com sucesso` 
            : `Não foi encontrado nenhum registro com o id ${req.params.id} para ser deletado`;
        res.status(200).send({ response });
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports.getAllDisciplinas = getAll;
module.exports.getDisciplinaById = getById;
module.exports.persistirDisciplina = persistir;
module.exports.excluirDisciplina = excluir;
