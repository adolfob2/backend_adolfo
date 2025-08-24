// models/detalle_pedido.model.js
import { DataTypes } from "sequelize";
import orm from "../config/sequelize.js";
import { Producto } from "./producto.model.js";

export const DetallePedido = orm.define("DetallePedido", {
  id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_pedido:  { type: DataTypes.INTEGER, allowNull: false },
  id_producto:{ type: DataTypes.INTEGER, allowNull: false },
  cantidad:   { type: DataTypes.INTEGER, allowNull: false },
  total:      { type: DataTypes.DOUBLE,  allowNull: false },  // CAMBIO: usa DOUBLE
}, {
  tableName: "detalle_pedido",
  timestamps: false,
});

// Relaciones
DetallePedido.belongsTo(Producto, { foreignKey: "id_producto", as: "producto" });
