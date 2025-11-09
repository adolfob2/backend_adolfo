// controllers/pedidos.controller.js
import { Pedido } from "../models/pedido.model.js";
import { DetallePedido } from "../models/detalle_pedido.model.js";

export const create = async (req, res) => {
  try {
    // Usuario autenticado (del token JWT)
    const id_usuario = req.user?.id || 1;

    const { fecha, total_pedido, direccion, telefono, costo_envio, carrito } = req.body;

    // Validaciones básicas
    if (!fecha || !total_pedido || !Array.isArray(carrito) || carrito.length === 0) {
      return res.status(400).json({ error: "Datos incompletos para crear el pedido" });
    }

    console.log("📦 Pedido recibido en backend:");
    console.log(JSON.stringify(req.body, null, 2));

    // Crear el pedido principal
    const pedido = await Pedido.create({
      id_usuario,
      fecha,
      total_pedido,
      direccion,
      telefono,
      costo_envio,
    });

    // Normalizar y validar los productos
    const detalles = carrito.map((item) => ({
      id_pedido: pedido.id,
      id_producto: item.id_producto ?? item.id, // por compatibilidad
      cantidad: item.cantidad ?? 1,
      total: item.total ?? (item.precio || 0) * (item.cantidad || 1),
    }));

    console.log("🧾 Detalles que se insertarán:");
    console.log(JSON.stringify(detalles, null, 2));

    // Validación extra antes de guardar
    for (const d of detalles) {
      if (!d.id_producto || !d.cantidad) {
        console.error("❌ Error: detalle inválido detectado:", d);
        return res.status(400).json({ error: "Detalle de pedido con datos inválidos" });
      }
    }

    // Guardar todos los detalles
    await DetallePedido.bulkCreate(detalles);

    res.status(201).json({
      message: "✅ Pedido creado correctamente",
      id_pedido: pedido.id,
    });
  } catch (error) {
    console.error("💥 Error en pedidos.controller.create:", error.message);
    console.error(error);
    res.status(500).json({ error: "Error al crear el pedido" });
  }
};


// ---------------------------------------------------------------------

export const getAll = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [{ model: DetallePedido }],
      order: [["fecha", "DESC"]],
    });
    res.json(pedidos);
  } catch (error) {
    console.error("Error en pedidos.controller.getAll:", error);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
};

// ---------------------------------------------------------------------

export const getById = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [{ model: DetallePedido }],
    });
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(pedido);
  } catch (error) {
    console.error("Error en pedidos.controller.getById:", error);
    res.status(500).json({ error: "Error al obtener pedido" });
  }
};

// ---------------------------------------------------------------------

export const getByUser = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      where: { id_usuario: req.params.id },
      include: [{ model: DetallePedido }],
    });
    res.json(pedidos);
  } catch (error) {
    console.error("Error en pedidos.controller.getByUser:", error);
    res.status(500).json({ error: "Error al obtener pedidos del usuario" });
  }
};

// ---------------------------------------------------------------------

export const deletes = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    await pedido.destroy();
    res.json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error("Error en pedidos.controller.deletes:", error);
    res.status(500).json({ error: "Error al eliminar pedido" });
  }
};

export const update = async (req, res) => {
  try {
    res.status(501).json({ message: "Funcionalidad de actualización no implementada aún" });
  } catch (error) {
    console.error("Error en pedidos.controller.update:", error);
    res.status(500).json({ error: "Error al actualizar pedido" });
  }
};
