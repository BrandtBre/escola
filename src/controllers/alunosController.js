const service = require('../services/alunosService');

const getAll = async (req, res) => {
    try {
        const response = await service.getAllAlunos();
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

const getById = async (req, res) => {
    try {
        const response = await service.getAlunoById(req.params);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

const persistir = async (req, res) => {
    try {
        const response = await service.persistirAluno(req.body);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

const excluir = async (req, res) => {
    try {
        let deletado = await service.excluirAluno(req.params);
        let response = deletado 
            ? `Registro ${req.params.id} deletado com sucesso` 
            : `Não foi encontrado nenhum registro com o id ${req.params.id} para ser deletado`;
        res.status(200).send({ response });
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports.getAllAlunos = getAll;
module.exports.getAlunoById = getById;
module.exports.persistirAluno = persistir;
module.exports.excluirAluno = excluir;
