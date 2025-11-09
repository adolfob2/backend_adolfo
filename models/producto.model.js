// models/producto.model.js
import { DataTypes } from 'sequelize';
import orm from '../config/sequelize.js';
import { Categoria } from './categoria.model.js';

export const Producto = orm.define('Producto', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:       { type: DataTypes.STRING(80), allowNull: false },
  precio:       { type: DataTypes.DOUBLE, allowNull: false },
  stock:        { type: DataTypes.INTEGER, allowNull: false },
  id_categoria: { type: DataTypes.INTEGER, allowNull: false },
  activo:       { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  imagen:       { type: DataTypes.STRING(255), allowNull: true }, // CAMBIO: nueva columna
}, {
  tableName: 'productos',
  timestamps: false,
});

// Relaciones (como en tu referencia Automovil/Marca/Tipo)
Categoria.hasMany(Producto, { foreignKey: 'id_categoria' });
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });

// === DEVUELVE OBJETO ANIDADO (producto + categoria) ===
export const getAll = async () => {
  const results = await Producto.findAll({
    include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] }],
    where: { activo: 1 }, // 👈 CAMBIO aquí (de true → 1)
  });
  return results.map(r => r.toJSON());
};


export const getById = async (id) => {
  const results = await Producto.findAll({
    include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] }],
    where: { activo: 1, id },
  });
  return results.map(r => r.toJSON());
};


export const create = async (obj) => {
  const created = await Producto.create({
    nombre: obj.nombre,
    precio: obj.precio,
    stock: obj.stock,
    id_categoria: obj.id_categoria,
    activo: true,
    imagen:       obj.imagen ?? null,   // CAMBIO
  });
  return created.toJSON().id;
};

export const update = async (id, obj) => {
  const [updated] = await Producto.update(
    { precio: obj.precio, stock: obj.stock },
    { where: { id } }
  );
  return updated;
};

export const deletes = async (id) => {
  const [updated] = await Producto.update(
    { activo: false },
    { where: { id } }
  );
  return updated;
};

// models/producto.model.js
// ... (lo que ya tienes arriba)

export const updateArchivo = async (id, filename) => {
  const [updated] = await Producto.update(
    { imagen: filename },        // guarda el nombre del archivo
    { where: { id } }
  );
  return updated;                // 0 o 1 (filas afectadas)
};


export const getReporte = async (preciobase) => {
  const result = await orm.query(
    'CALL limpieza_pro.get_reporte(?)',
    { replacements: [preciobase] }
  );
  // Normaliza la forma del resultado (directo vs. anidado)
  const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
  return rows;
};

export const getImagenById = async (id) => {
  const row = await Producto.findByPk(id, { attributes: ['imagen'] });
  return row ? row.imagen : null;
};
