// controllers/pedidos.controller.js
import * as spedidos from "../services/pedidos.services.js";

export const getAll = async (req, res) => {
  try {
    const rows = await spedidos.getAll();
    res.json(rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo pedidos" });
  }
};

export const getById = async (req, res) => {
  try {
    const p = await spedidos.getById(req.params.id);
    if (!p) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo el pedido" });
  }
};

export const create = async (req, res) => {
  try {
    const { id_usuario, items } = req.body;
    if (!id_usuario || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "id_usuario e items son obligatorios" });
    }
    const id = await spedidos.create({ id_usuario, items });
    res.status(201).json({ mensaje: "Pedido creado", id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Error creando pedido" });
  }
};

export const update = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items es obligatorio y no puede estar vacío" });
    }
    await spedidos.update(req.params.id, { items });
    res.json({ mensaje: "Pedido actualizado" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Error actualizando pedido" });
  }
};

export const deletes = async (req, res) => {
  try {
    await spedidos.deletes(req.params.id);
    res.json({ mensaje: "Pedido eliminado" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Error eliminando pedido" });
  }
};
