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

module.exports.getAllNotas = getAll;
module.exports.getNotaById = getById;
module.exports.persistirNota = persistir;
module.exports.excluirNota = excluir;