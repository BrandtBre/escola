const db = require("../config/db");

const getAll = async () => {
    let sql = 'select * from notas';
    let notas = await db.query(sql);
    return notas.rows;
}

const getById = async (params) => {
    let sql = `select * from notas where id = $1`;
    let Nota = await db.query(sql, [params.id]);
    return Nota.rows;
}

const persistir = async (params) => {
    if (!params.id) {
      let sql = `insert into notas (nota, peso, id_disciplina, id_aluno, observacao)
        values ($1, $2, $3, $4, $5) returning id;`
      const { nota, peso, id_disciplina, id_aluno, observacao } = params;
      const query = await db.query(sql, [nota, peso, id_disciplina, id_aluno, observacao]);
  
      return { type: 'info', msg: 'Registro incluído com sucesso!', data: { id: query.rows[0].id } };
    }
  
    let fields = [];
  
    Object.keys(params).forEach(e => {
      if (e !== 'id') {
        if (params[e] === '' || params[e] == null) {
          fields.push(`${e} = null`)
        } else {
          fields.push(`${e} = '${params[e]}'`)
        }
      }
    });
    fields = fields.join(', ');
    const sql = `update notas set ${fields} where id = ${params.id}`;
  
    const response = await db.query(sql);
    const msg = response.rowCount === 0
      ? `Não foi encontrado nenhum registro com o id ${params.id}`
      : `Registro ${params.id} alterado com sucesso!`;
  
    return { type: 'info', msg }
}

const excluir = async (params) => {
    let sql = 'delete from notas where id = $1;';
    let query = await db.query(sql, [params.id]);
    return query.rowCount == 1;
}

const mediaAluno = async (params) => {
   
  let { matricula, id_disciplina, data_inicial, data_final } = params;

  let sql = `
      select 
          a.id,
          p.nome,
          n.nota,
          n.peso
      from notas as n
      inner join alunos as a on (n.id_aluno = a.id)
      inner join pessoas as p on (a.id_pessoa = p.id)
      where a.matricula = $1 and n.id_disciplina = $2 and n.datahora::date between $3 and $4
  `;


  let response = await db.query(sql, [matricula, id_disciplina, data_inicial, data_final]);

  let somaNotas = 0;
  let somaPesos = 0;
  
  response.rows.forEach(notaDoAluno => {
      somaNotas += (parseFloat(notaDoAluno.nota) * (parseFloat(notaDoAluno.peso)))
      somaPesos += parseFloat(notaDoAluno.peso)
  });


  let media = somaNotas / somaPesos;
  let mensagem = media < 5.0 ? `${response.rows[0].nome}, você está reprovado` : (media >= 5 && media < 7 ? `${response.rows[0].nome}, você está em recuperação` : `${response.rows[0].nome}, você está aprovado`)

  return {
      notas: response.rows.map(nota => {
        return { peso: nota.peso, nota: nota.nota }
      }),
      media: media,
      msg: mensagem
      
  }
}

const mediaAllAlunos = async (params) => {
  
  let { id_disciplina, data_inicial, data_final } = params;

  let sql = `
      select 
          p.nome,
          n.nota,
          n.peso,
          a.matricula,
          n.id_disciplina,
          a.id
      from notas as n
      inner join alunos as a on (n.id_aluno = a.id)
      inner join pessoas as p on (a.id_pessoa = p.id)
      where n.id_disciplina = $1 and n.datahora::date between $2 and $3
  `;

  let response = await db.query(sql, [ id_disciplina, data_inicial, data_final]);

  let somaNotas = 0;
  let somaPesos = 0;
  let media = 0;
  let medias = [];


  for (let index = 0; index < response.rows.length; index++) {
    somaNotas += parseFloat(response.rows[index].nota) * parseFloat(response.rows[index].peso)
    somaPesos += parseFloat(response.rows[index].peso)
    if (!response.rows[index + 1] || response.rows[index].id !== response.rows[index + 1].id) {
      media = (somaNotas / somaPesos).toFixed(2);
      somaNotas = 0;
      somaPesos = 0;
      
      let mensagem = media < 5.0 ? `${response.rows[index].nome}, você está reprovado` : (media >= 5 && media < 7 ? `${response.rows[index].nome}, você está em recuperação` : `${response.rows[index].nome}, você está aprovado`)
      
      medias.push({
        nome: response.rows[index].nome,
        media: media,
        situacao: mensagem
      })
      
    }
    
  
  }
  
  
  return medias;
 
}

module.exports.getAllNotas = getAll;
module.exports.getNotaById = getById;
module.exports.persistirNota = persistir;
module.exports.excluirNota = excluir;
module.exports.mediaAluno = mediaAluno;
module.exports.mediaAllAlunos = mediaAllAlunos;