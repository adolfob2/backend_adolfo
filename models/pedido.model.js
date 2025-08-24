// models/pedido.model.js
import { DataTypes } from "sequelize";
import orm from "../config/sequelize.js";
import { Usuario } from "./usuario.model.js";        // CAMBIO: si ya lo tienes definido
import { DetallePedido } from "./detalle_pedido.model.js";

export const Pedido = orm.define("Pedido", {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_usuario:   { type: DataTypes.INTEGER, allowNull: false },
  fecha:        { type: DataTypes.DATE,    allowNull: false, defaultValue: DataTypes.NOW },
  total_pedido: { type: DataTypes.DOUBLE,  allowNull: false, defaultValue: 0 },
}, {
  tableName: "pedidos",
  timestamps: false,
});

// Relaciones
Pedido.belongsTo(Usuario,       { foreignKey: "id_usuario", as: "usuario" });
Pedido.hasMany(DetallePedido,   { foreignKey: "id_pedido",  as: "detalles" });
