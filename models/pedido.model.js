// models/pedido.model.js
import { DataTypes } from "sequelize";
import orm from "../config/sequelize.js";
import { DetallePedido } from "./detalle_pedido.model.js";
import { Usuario } from "./usuario.model.js";

export const Pedido = orm.define(
  "Pedido",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false },
    total_pedido: { type: DataTypes.DOUBLE, allowNull: false },
    direccion: { type: DataTypes.STRING(255), allowNull: true },
    telefono: { type: DataTypes.STRING(20), allowNull: true },
    costo_envio: { type: DataTypes.DOUBLE, allowNull: true },
  },
  {
    tableName: "pedidos",
    timestamps: false,
  }
);

// Relaciones
Pedido.hasMany(DetallePedido, { foreignKey: "id_pedido" });
DetallePedido.belongsTo(Pedido, { foreignKey: "id_pedido" });

Usuario.hasMany(Pedido, { foreignKey: "id_usuario" });
Pedido.belongsTo(Usuario, { foreignKey: "id_usuario" });

export default Pedido;
