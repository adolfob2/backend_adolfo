

// services/catalogo.services.js
//import pool from "../config/db.js"; // ← importante el .js
//import * as modelProducto from "../models/producto.model.js";

/*export const getAll = () =>
  new Promise((resolve, reject) => {
    pool.query(
      'select p.id, p.nombre, p.precio, p.stock, p.id_categoria, ' +
      'c.nombre as categoria ' +
      'from ecommerceg1.productos p ' +
      'inner join ecommerceg1.categoria c on p.id_categoria = c.id ' +
      'where p.activo = true',
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });

/*export const getById = (id) =>
  new Promise((resolve, reject) => {
    pool.query(
      'select p.id, p.nombre, p.precio, p.stock, p.id_categoria, ' +
      'c.nombre as categoria ' +
      'from ecommerceg1.productos p ' +
      'inner join ecommerceg1.categoria c on p.id_categoria = c.id ' +
      'where p.activo = true and p.id = ?',
      [id],
      (err, results) => (err ? reject(err) : resolve(results[0]))
    );
  });

export const getByIdSequelize = async function(id) {
    console.log("------------service------------");
    //await modelAutomovil.connect();
    const results= await modelProducto.getById(id);
    console.log("luego del modelProducto");
    return results;
};

export const create = (nombre, precio, stock, id_categoria, activo = true) =>
  new Promise((resolve, reject) => {
    pool.query(
      'insert into ecommerceg1.productos (nombre, precio, stock, id_categoria, activo) ' +
      'values (?, ?, ?, ?, ?)',
      [nombre, precio, stock, id_categoria, activo],
      (err, results) => (err ? reject(err) : resolve(results.insertId))
    );
  });

// UPDATE
export const update = function (id, objProducto) {
  return new Promise((resolve, reject) => {
    pool.query(
      'update ecommerceg1.productos set precio = ?, stock = ? ' + // ← espacio antes de where
      'where id = ?',
      [objProducto.precio, objProducto.stock, id],
      (err, results) => (err ? reject(err) : resolve(results.affectedRows))
    );
  });
};

//eliminacion logica
export const deletes = function(id) {
    return new Promise( (resolve, reject) => {
        pool.query(
            'update ecommerceg1.productos set activo=false '+
            'where id =? ', [id], 
            (err, results, fields) =>{
                console.log(results);
                if (err) reject(err);
                else resolve(results.affectedRows);
            });
    });
};*/

// services/catalogo.services.js
//import pool from "../config/db.js";
import * as modelProducto from "../models/producto.model.js";
import * as archivos from "../utils/archivos.js";

// LISTAR
export const getAll = async () => {
  const rows = await modelProducto.getAll();
  return rows; // array de productos
};

// OBTENER POR ID (tu función actual)
export const getById = async function (id) {
  const rows = await modelProducto.getById(id);
  return rows; // array con 0 o 1 fila; el controller puede responder 404 si length===0
};

// CREAR
export const create = async (objProducto) => {
  const insertId = await modelProducto.create(objProducto);
  return insertId; // id insertado
};

// ACTUALIZAR (precio/stock según tu query)
export const update = async (id, objProducto) => {
  const affected = await modelProducto.update(id, objProducto);
  return affected; // filas afectadas
};

// ELIMINACIÓN LÓGICA
export const deletes = async (id) => {
  const affected = await modelProducto.deletes(id);
  return affected; // filas afectadas
};

export const getReporte = async function(preciobase) {
    const results= await modelProducto.getReporte(preciobase);
    return results;
};

export const updateArchivo = async function(idProducto, filename) {
    const results= await modelProducto.updateArchivo(idProducto, filename);
    return results;
};

export const downloadArchivo = async (idProducto) => {
  const filename = await modelProducto.getImagenById(idProducto); // ← usa 'imagen'
  if (!filename) return null;
  return archivos.getArchivo(filename);   // construye la ruta ./uploads/<filename>
};

