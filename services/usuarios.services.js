// services/usuarios.services.js
import { Op } from "sequelize";
import { Usuario } from "../models/usuario.model.js";
import { TipoDocumento } from "../models/tipo.documento.model.js";

// LISTAR (incluye tipoDocumento)
export const getAll = async () => {
  const rows = await Usuario.findAll({
    include: [{ model: TipoDocumento, as: "tipoDocumento", attributes: ["id_tipodocumento", "nombre"] }],
    order: [["id_persona", "DESC"]],
  });
  return rows.map(r => r.toJSON());
};

// OBTENER POR ID (incluye tipoDocumento)
export const getById = async (id_persona) => {
  const row = await Usuario.findOne({
    where: { id_persona },
    include: [{ model: TipoDocumento, as: "tipoDocumento", attributes: ["id_tipodocumento", "nombre"] }],
  });
  return row ? row.toJSON() : null;
};

// CREAR
// data: { nombre, email, password, rol, id_tipodocumento, ... }
export const create = async (data) => {
  // valida obligatorios (igual que tu controller OLD)
  const requeridos = ["nombre", "email", "password", "rol", "id_tipodocumento"];
  const falta = requeridos.find(k => data[k] === undefined || data[k] === null || data[k] === "");
  if (falta) throw new Error(`Falta campo obligatorio: ${falta}`);

  // (opcional) email único si la BD no tiene UNIQUE
  const existe = await Usuario.findOne({ where: { email: data.email } });
  if (existe) throw new Error("El email ya está registrado");

  const u = await Usuario.create({
    nombre: data.nombre,
    email: data.email,
    password: data.password,          // si luego quieres hash, lo añadimos
    rol: data.rol,
    id_tipodocumento: data.id_tipodocumento,
    numintentos: data.numintentos ?? 0,
    fingreso: data.fingreso ?? true,
    otp: data.otp ?? null,
  });

  return u.toJSON().id_persona;
};

// ACTUALIZAR (campos permitidos)
export const update = async (id_persona, data) => {
  const allowed = ["nombre", "email", "password", "rol", "id_tipodocumento", "numintentos", "fingreso", "otp"];
  const patch = {};
  for (const k of allowed) if (data[k] !== undefined) patch[k] = data[k];

  // si viene email, valida que no choque con otro usuario
  if (patch.email) {
    const otro = await Usuario.findOne({
      where: { email: patch.email, id_persona: { [Op.ne]: id_persona } },
    });
    if (otro) throw new Error("El email ya está registrado por otro usuario");
  }

  const [aff] = await Usuario.update(patch, { where: { id_persona } });
  return aff; // filas afectadas
};

// ELIMINACIÓN LÓGICA (fingreso=false)
export const deletes = async (id_persona) => {
  const [aff] = await Usuario.update({ fingreso: false }, { where: { id_persona } });
  return aff;
};
