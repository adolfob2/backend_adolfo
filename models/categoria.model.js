// models/categoria.model.js
import {Sequelize, DataTypes} from 'sequelize';
import orm from '../config/sequelize.js';

export const Categoria = orm.define('Categoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,     // ← case correcto
  },
  nombre: {
    type: DataTypes.STRING(80), // ← coincide con tu tabla
    allowNull: false,
    validate: { len: [1, 80] },
  },
}, {
  tableName: 'categoria',
  timestamps: false,
});

export const connect = async () => {
  await orm.authenticate();   // ← no es orm,authenticate()
  console.log('conexion establecida');
};

