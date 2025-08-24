/*import pool from "../config/db.js"

export const login = function(objUsuario){

console.log ("-----------service--------");
return new Promise ((resolve, reject)=> {
    pool.query(
        'select u.id_persona, u.email, u.password, u.rol from ecommerceg1.usuarios u '+
        'where u.email=? and u.fingreso=true',
        [objUsuario.email],
        (err,results, fields)=> {
            console.log(results);
            if (err) reject(err);
            else resolve(results);
        }
    );
});
}

export const findById = (id_persona) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'select u.id_persona, u.email, u.password, u.rol ' +
      'from ecommerceg1.usuarios u ' +
      'where u.id_persona = ? and u.fingreso = true',
      [id_persona],
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};*/

// services/seguridad.services.js
import pool from "../config/db.js";

export const login = async (objUsuario) => {
  const [rows] = await pool.query(
    `select u.id_persona, u.email, u.password, u.rol
     from ecommerceg1.usuarios u
     where u.email = ? and u.fingreso = true`,
    [objUsuario.email]
  );
  return rows;           // array (0..1)
};

export const findById = async (id_persona) => {
  const [rows] = await pool.query(
    `select u.id_persona, u.email, u.password, u.rol
     from ecommerceg1.usuarios u
     where u.id_persona = ? and u.fingreso = true`,
    [id_persona]
  );
  return rows;           // array (0..1)
};
