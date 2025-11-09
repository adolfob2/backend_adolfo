

// controllers/catalogo.controller.js
import * as scatalogo from "../services/catalogo.services.js";
import * as sfile from "../services/file.service.js";
import path from "path";
import sanitizeHtml from 'sanitize-html';

export const getAll = async function(req, res) {
    console.log("------------controller------------");
    try{
        const productos = await scatalogo.getAll();
        console.log("... despues de scatalogo.getAll()");
        res.json(productos || []);    
    }
    catch(error){
        res.status(500).json({"error":"Error obteniendo registros"});
    };
};

export const getById = async function (req, res) {
  try {
    const rows = await scatalogo.getById(req.params.id);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Catalogo.getById ERROR:", error);
    res.status(500).json({ error: "Error obteniendo registros" });
  }
};


export const create = async function(req, res) {
    const objProducto = req.body;
    console.log(objProducto);
    console.log(req.user);

    // --- SANITIZACIÓN: quitar etiquetas HTML / scripts ---
    objProducto.nombre = sanitizeHtml(objProducto.nombre || '', { allowedTags: [], allowedAttributes: {} });
    objProducto.descripcion = sanitizeHtml(objProducto.descripcion || '', { allowedTags: [], allowedAttributes: {} });

    try{
        let id = await scatalogo.create(objProducto);
        console.log("... despues de scatalogo.create()");
        res.json( {"id":id} );
    }catch(error){
        res.status(500).json({"error":"Error ingresando registros"});
    };
};


export const update = async function(req, res) {
    console.log("------------controller------------");
    const objProducto = req.body;
    console.log(objProducto);

    // --- SANITIZACIÓN: quitar etiquetas HTML / scripts (si vienen campos textuales) ---
    objProducto.nombre = sanitizeHtml(objProducto.nombre || '', { allowedTags: [], allowedAttributes: {} });
    objProducto.descripcion = sanitizeHtml(objProducto.descripcion || '', { allowedTags: [], allowedAttributes: {} });

    await scatalogo.update(req.params.id, objProducto)
    .then(numRegistros => {
        console.log("... despues de scatalogo.update()");
        res.json( {"numRegistros":numRegistros} );
    })
    .catch(err => {
        res.status(500).json({"error":"Error actualizando registros"});
    });
};


export const deletes = async function(req, res) {
    await scatalogo.deletes(req.params.id)
    .then(numRegistros => {
        console.log("... despues de scatalogo.deletes()");
        res.json( {"numRegistros":numRegistros} );
    })
    .catch(err => {
        res.status(500).json({"error":"Error eliminando registros"});
    });
};

export const getReporte = async function(req, res) {
    console.log(req.body.preciobase);

    try{
        let productos= await scatalogo.getReporte(req.body.preciobase);
        console.log("... despues de scatalogo.getReporte()");
        res.json( productos || [] );
    }catch(error){
        res.status(500).json({"error":"Error obteniendo registros"});
    };
};

export const upload = async function (req, res){

      console.log("--------controller----------");
      const objProducto=req.body;
      try {
        
        sfile.uploadProducto(req, res);
        console.log("response luego de upload");

      } catch (error) {
        res.status(500).json({"error":"Error actualizando registros"});
      };

};

export const download = async (req, res) => {
  try {
    const filePath = await scatalogo.downloadArchivo(req.params.id);
    if (!filePath) return res.status(404).json({ error: "Archivo no encontrado" });
    return res.sendFile(path.resolve(filePath)); // o res.download(path.resolve(filePath))
  } catch (err) {
    console.error("Catalogo.download ERROR:", err);
    res.status(500).json({ error: "Error descargando archivo" });
  }
};

// NUEVO ENDPOINT: obtener todas las categorías
import pool from "../config/db.js"; // asegúrate de que el path sea correcto según tu proyecto

export const getCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, nombre FROM categoria ORDER BY id");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};


// controllers/catalogo.controller.js
/*import * as scatalogo from "../services/catalogo.services.js";

export const getAll = async (req, res) => {
  try {
    const productos = await scatalogo.getAll();
    res.json(productos || []);
  } catch (error) {
    console.error("Catalogo.getAll ERROR:", error);
    res.status(500).json({ error: "Error obteniendo registros" });
  }
};

export const getById = async (req, res) => {
  try {
    const rows = await scatalogo.getById(req.params.id);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Catalogo.getById ERROR:", error);
    res.status(500).json({ error: "Error obteniendo registros" });
  }
};

export const create = async (req, res) => {
  try {
    const id = await scatalogo.create(req.body);
    res.status(201).json({ id });
  } catch (error) {
    console.error("Catalogo.create ERROR:", error);
    res.status(500).json({ error: "Error ingresando registros" });
  }
};

export const update = async (req, res) => {
  try {
    const numRegistros = await scatalogo.update(req.params.id, req.body);
    res.json({ numRegistros });
  } catch (error) {
    console.error("Catalogo.update ERROR:", error);
    res.status(500).json({ error: "Error actualizando registros" });
  }
};

export const deletes = async (req, res) => {
  try {
    const numRegistros = await scatalogo.deletes(req.params.id);
    res.json({ numRegistros });
  } catch (error) {
    console.error("Catalogo.deletes ERROR:", error);
    res.status(500).json({ error: "Error eliminando registros" });
  }
};

export const getReporte = async (req, res) => {
  try {
    const productos = await scatalogo.getReporte(req.body.preciobase);
    res.json(productos || []);
  } catch (error) {
    console.error("Catalogo.getReporte ERROR:", error);
    res.status(500).json({ error: "Error obteniendo registros" });
  }
};*/



