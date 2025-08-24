// services/pedidos.services.js
import orm from "../config/sequelize.js";
import { Pedido } from "../models/pedido.model.js";
import { DetallePedido } from "../models/detalle_pedido.model.js";
import { Producto } from "../models/producto.model.js";
import { Usuario } from "../models/usuario.model.js";

// GET: lista pedidos con usuario y suma de items
export const getAll = async () => {
  const rows = await Pedido.findAll({
    include: [
      { model: Usuario, as: "usuario", attributes: ["id_persona", "nombre", "email"] },
      {
        model: DetallePedido,
        as: "detalles",
        attributes: ["id", "id_producto", "cantidad", "total"],
      },
    ],
    order: [["id", "DESC"]],
  });

  // Devuelve igual que antes pero con "items" calculado (suma de cantidades)
  return rows.map((r) => {
    const o = r.toJSON();
    const items = (o.detalles || []).reduce((acc, d) => acc + Number(d.cantidad || 0), 0);
    return { ...o, items };
  });
};

// GET: 1 pedido por id (usuario + detalles + producto)
export const getById = async (id) => {
  const row = await Pedido.findOne({
    where: { id },
    include: [
      { model: Usuario, as: "usuario", attributes: ["id_persona", "nombre", "email"] },
      {
        model: DetallePedido,
        as: "detalles",
        include: [{ model: Producto, as: "producto", attributes: ["id", "nombre", "precio"] }],
      },
    ],
  });
  return row ? row.toJSON() : null;
};

// POST: crear pedido con items [{ id_producto, cantidad }, ...]
export const create = async ({ id_usuario, items }) => {
  const t = await orm.transaction();
  try {
    // valida usuario
    const user = await Usuario.findByPk(id_usuario, { transaction: t });
    if (!user) throw new Error(`Usuario ${id_usuario} no existe`);

    // crea encabezado
    const pedido = await Pedido.create(
      { id_usuario, fecha: new Date(), total_pedido: 0 },
      { transaction: t }
    );

    let totalPedido = 0;

    // procesa items
    for (const it of items) {
      const { id_producto, cantidad } = it || {};
      if (!id_producto || !cantidad || cantidad <= 0) throw new Error("Item inválido");

      // bloqueo de fila para stock consistente
      const prod = await Producto.findByPk(id_producto, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!prod || prod.activo !== true) {
        throw new Error(`Producto ${id_producto} no existe o está inactivo`);
      }
      if (Number(prod.stock) < Number(cantidad)) {
        throw new Error(`Stock insuficiente para producto ${id_producto}`);
      }

      const subtotal = Number(prod.precio) * Number(cantidad);
      totalPedido += subtotal;

      // crea detalle
      await DetallePedido.create(
        {
          id_pedido: pedido.id,
          id_producto,
          cantidad,
          total: subtotal,
        },
        { transaction: t }
      );

      // descuenta stock
      await prod.update(
        { stock: Number(prod.stock) - Number(cantidad) },
        { transaction: t }
      );
    }

    // actualiza total del pedido
    await pedido.update({ total_pedido: totalPedido }, { transaction: t });

    await t.commit();
    return pedido.id;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

// PUT/PATCH: reemplaza todo el detalle del pedido
export const update = async (id_pedido, { items }) => {
  const t = await orm.transaction();
  try {
    const pedido = await Pedido.findByPk(id_pedido, { transaction: t });
    if (!pedido) throw new Error("Pedido no encontrado");

    // repone stock de detalle actual
    const detalleActual = await DetallePedido.findAll({
      where: { id_pedido },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    for (const d of detalleActual) {
      const prod = await Producto.findByPk(d.id_producto, { transaction: t, lock: t.LOCK.UPDATE });
      if (prod) {
        await prod.update(
          { stock: Number(prod.stock) + Number(d.cantidad) },
          { transaction: t }
        );
      }
    }

    // borra detalle actual
    await DetallePedido.destroy({ where: { id_pedido }, transaction: t });

    // valida y crea nuevo detalle
    let totalPedido = 0;
    for (const it of items) {
      const { id_producto, cantidad } = it || {};
      if (!id_producto || !cantidad || cantidad <= 0) throw new Error("Item inválido");

      const prod = await Producto.findByPk(id_producto, { transaction: t, lock: t.LOCK.UPDATE });
      if (!prod || prod.activo !== true) throw new Error(`Producto ${id_producto} no existe o está inactivo`);
      if (Number(prod.stock) < Number(cantidad)) throw new Error(`Stock insuficiente para producto ${id_producto}`);

      const subtotal = Number(prod.precio) * Number(cantidad);
      totalPedido += subtotal;

      await DetallePedido.create(
        { id_pedido, id_producto, cantidad, total: subtotal },
        { transaction: t }
      );

      await prod.update(
        { stock: Number(prod.stock) - Number(cantidad) },
        { transaction: t }
      );
    }

    // actualiza total
    await pedido.update({ total_pedido: totalPedido }, { transaction: t });

    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

// DELETE: repone stock y elimina pedido + detalle
export const deletes = async (id_pedido) => {
  const t = await orm.transaction();
  try {
    const detalle = await DetallePedido.findAll({
      where: { id_pedido },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    for (const d of detalle) {
      const prod = await Producto.findByPk(d.id_producto, { transaction: t, lock: t.LOCK.UPDATE });
      if (prod) {
        await prod.update(
          { stock: Number(prod.stock) + Number(d.cantidad) },
          { transaction: t }
        );
      }
    }

    await DetallePedido.destroy({ where: { id_pedido }, transaction: t });
    const deleted = await Pedido.destroy({ where: { id: id_pedido }, transaction: t });

    if (!deleted) throw new Error("Pedido no encontrado");

    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
