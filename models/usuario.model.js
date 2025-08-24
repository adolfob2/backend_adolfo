// models/usuario.model.js
import { DataTypes } from 'sequelize';
import orm from '../config/sequelize.js';
import { TipoDocumento } from './tipo.documento.model.js'; // ← ojo al nombre del archivo

export const Usuario = orm.define('Usuario', {
  id_persona: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  // en tu BD existe "nombre" (si no lo tuvieras, elimina esta línea)
  nombre: { type: DataTypes.STRING(100), allowNull: false },

  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,                 // recomendado: pon UNIQUE también en la BD
    validate: { isEmail: true },
  },

  password: { type: DataTypes.STRING(255), allowNull: false },

  numintentos: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },

  fingreso: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

  otp: { type: DataTypes.STRING(10), allowNull: true },

  rol: { type: DataTypes.STRING(45), allowNull: false, defaultValue: 'CLIENTE' },

  // NUEVO: FK a tipo_documento (ajusta allowNull según cómo dejaste la columna)
  id_tipodocumento: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

// Relación: usuarios.id_tipodocumento → tipo_documento.id_tipodocumento
Usuario.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento', as: 'tipoDocumento' });

// --- helpers opcionales, compatibles con tus services actuales ---

export const connect = async () => {
  await orm.authenticate();
  console.log('conexion establecida');
};

export const findAll = async () => {
  const rows = await Usuario.findAll({
    include: [{ model: TipoDocumento, as: 'tipoDocumento', attributes: ['nombre'] }],
  });
  return rows.map(r => r.toJSON());
};

export const login = async (objUsuario) => {
  const rows = await Usuario.findAll({
    where: { email: objUsuario.email, fingreso: true },
  });
  return rows.map(r => r.toJSON()); // incluye password para validación en el controller
};

export const findById = async (id_persona) => {
  const rows = await Usuario.findAll({
    where: { id_persona, fingreso: true },
  });
  return rows.map(r => r.toJSON());
};

