// services/pedidos.services.js
import orm from "../config/sequelize.js";
import { Pedido } from "../models/pedido.model.js";
import { DetallePedido } from "../models/detalle_pedido.model.js";

// Crear pedido + detalles (transacción)
export const create = async (pedidoData) => {
  const { id_usuario, fecha, total_pedido, direccion, telefono, costo_envio, carrito } = pedidoData;

  const transaction = await orm.transaction();
  try {
    // 1️⃣ Crear el pedido
    const pedido = await Pedido.create(
      { id_usuario, fecha, total_pedido, direccion, telefono, costo_envio },
      { transaction }
    );

    // 2️⃣ Insertar los detalles del carrito
    for (const item of carrito) {
      await DetallePedido.create(
        {
          id_pedido: pedido.id,
          id_producto: item.id,
          cantidad: item.cantidad,
          total: item.precio * item.cantidad,
        },
        { transaction }
      );
    }

    await transaction.commit();
    return pedido.id;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Listar todos los pedidos
export const getAll = async () => {
  const pedidos = await Pedido.findAll({
    include: [{ model: DetallePedido }],
  });
  return pedidos.map((p) => p.toJSON());
};

// Obtener pedidos por usuario
export const getByUser = async (id_usuario) => {
  const pedidos = await Pedido.findAll({
    where: { id_usuario },
    include: [{ model: DetallePedido }],
  });
  return pedidos.map((p) => p.toJSON());
};
