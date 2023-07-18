const db = require('./configuracion');

function pedirTodas(tabla, callback) {
    db.any(`SELECT * FROM ${tabla} WHERE id = $(id)`)
      .then(resultado => {
        callback(null, resultado);
      })
      .catch(error => {
        callback(error);
      });
}

function pedir(tabla, id, callback) {
  db.any(`SELECT * FROM ${tabla} WHERE id = ${id}`)
  .then(resultado => {
    callback(null, resultado);
  })
  .catch(error => {
    callback(error);
  });
}

function Crear(tabla, item, callback) {
  const keys = Object.keys(item);
  const propiedades = keys.join(', ');
  const valores = keys.map(key => `'${item[key]}'`).join(', ');

  db.any(`INSERT INTO ${tabla} (${propiedades}) VALUES(${valores}) returning *`)
  .then(([resultado]) => {
    callback(null, resultado);
  })
  .catch(error => {
    callback(error);
  });
}

function Actualizar(tabla, id, item, callback) {
  const keys = Object.keys(item);
  const Actualizaciones = keys.map(key => `${key} = '${item[key]}'`).join(', ')

  const sql = `UPDATE ${tabla} SET ${Actualizaciones} WHERE id = ${id} returnin *`;
  db.any(sql)
    .then(([resultado]) => {
      callback(null, resultado);
    })
    .catch(error => {
      callback(error);
    }); 
}

function borrar(tabla, id, callback) {
  db.any(`DELETE FROM ${tabla} WHERE id =${id}`)
  .then(() => {
    callback(null);
  })
  .catch(error => {
    callback(error);
  });
}

module.exports = {
    pedirTodas,
    pedir,
    Crear,
    Actualizar,
    borrar
};