// controllers/usuarios.controller.js
import * as susuarios from "../services/usuarios.services.js";

export const getAll = async (req, res) => {
  try {
    const rows = await susuarios.getAll();
    res.json(rows || []);
  } catch (err) {
    console.error("Usuarios.getAll ERROR:", err);
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
};

export const getById = async (req, res) => {
  try {
    const u = await susuarios.getById(req.params.id);
    if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(u);
  } catch (err) {
    console.error("Usuarios.getById ERROR:", err);
    res.status(500).json({ error: "Error obteniendo usuario" });
  }
};

export const create = async (req, res) => {
  try {
    const { nombre, email, password, rol, id_tipodocumento } = req.body;
    if (!nombre || !email || !password || !rol || !id_tipodocumento) {
      return res.status(400).json({ error: "nombre, email, password, rol e id_tipodocumento son obligatorios" });
    }
    const idNuevo = await susuarios.create(req.body);
    res.status(201).json({ mensaje: "Usuario creado", id_persona: idNuevo });
  } catch (err) {
    console.error("Usuarios.create ERROR:", err);
    res.status(400).json({ error: err.message || "Error creando usuario" });
  }
};

export const update = async (req, res) => {
  try {
    const aff = await susuarios.update(req.params.id, req.body);
    res.json({ actualizados: aff });
  } catch (err) {
    console.error("Usuarios.update ERROR:", err);
    res.status(500).json({ error: "Error actualizando usuario" });
  }
};

export const deletes = async (req, res) => {
  try {
    const aff = await susuarios.deletes(req.params.id);
    res.json({ eliminados: aff });
  } catch (err) {
    console.error("Usuarios.deletes ERROR:", err);
    res.status(500).json({ error: "Error eliminando usuario" });
  }
};
