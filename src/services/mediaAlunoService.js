const db = require("../config/db");

const mediaAluno = async (params) => {
   
    let { matricula, id_disciplina, data_iniscial, data_final } = params;

    let sql = `
        select 

            n.nota,
            n.peso
        from notas as n
        inner join alunos as a on (n.id_aluno = a.id)
        inner join pessoas as p on (a.id_pessoa = p.id)
        where a.matricula = $1 and n.id_disciplina = $2 and n.datahora::date beetween $3 and $4
    `;


    let response = await db.query(sql, [matricula, id_disciplina, data_iniscial, data_final]);

    let somaNotas = 0;
    let somaPesos = 0;
    
    response.rows.forEach(notaDoAluno => {
        somaNotas += (parseFloat(notaDoAluno.nota) * (parseFloat(notaDoAluno.peso)))
        somaPesos += parseFloat(notaDoAluno.peso)
    });

    let media = somaNotas / somaPesos;

    return {
        msg: mensagem = media < 5.0 ? `${response.rows[0]}, você está reprovaado` : (media >= 5 ? `${response.rows}, você está em recuperação` : `${response.rows[0]}, você está aprovado`),
    }
}


module.exports.mediaAluno = mediaAluno; 