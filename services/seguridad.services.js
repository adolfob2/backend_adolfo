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
// services/seguridad.services.js
import pool from "../config/db.js";

// --------------------------------------
// LOGIN
// --------------------------------------
export const login = async ({ email }) => {
  const [rows] = await pool.query(
    `SELECT u.id_persona, u.nombre, u.email, u.password, u.rol
     FROM limpieza_pro.usuarios u
     WHERE u.email = ? AND u.fingreso = TRUE`,
    [email]
  );
  return rows; // array con 0 o 1 usuario
};

// --------------------------------------
// BUSCAR POR ID (para refresh token)
// --------------------------------------
export const findById = async (id_persona) => {
  const [rows] = await pool.query(
    `SELECT u.id_persona, u.nombre, u.email, u.password, u.rol
     FROM limpieza_pro.usuarios u
     WHERE u.id_persona = ? AND u.fingreso = TRUE`,
    [id_persona]
  );
  return rows;
};

// --------------------------------------
// BUSCAR POR EMAIL (para registrar)
// --------------------------------------
export const findByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT u.id_persona, u.nombre, u.email, u.password, u.rol
     FROM limpieza_pro.usuarios u
     WHERE u.email = ?`,
    [email]
  );
  return rows;
};

// --------------------------------------
// REGISTRAR NUEVO USUARIO
// --------------------------------------
export const registrarUsuario = async ({ nombre, email, password, rol }) => {
  const [result] = await pool.query(
    `INSERT INTO limpieza_pro.usuarios (nombre, email, password, rol, fingreso, numintentos, id_tipodocumento)
     VALUES (?, ?, ?, ?, TRUE, 0, 1)`,
    [nombre, email, password, rol]
  );

  return {
    id_persona: result.insertId,
    nombre,
    email,
    rol,
  };
};
