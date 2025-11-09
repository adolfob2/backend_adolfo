import * as sseguridad from "../services/seguridad.services.js";
import * as auth from "../config/auth.js";
import bcrypt from "bcryptjs";  // <-- importante para hashear contraseñas

// --------------------------------------
// LOGIN
// --------------------------------------
export const login = async (req, res) => {
  console.log("------------controller: login ------------");
  const { email, password } = req.body;

  try {
    const usuarios = await sseguridad.login({ email });
    if (!usuarios[0]) {
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

    const usuario = usuarios[0];
    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      return res.status(403).json({ error: "Contraseña incorrecta" });
    }

    const token = auth.generateToken(usuario);
    const refreshToken = auth.generaterefreshToken(usuario);

    res.json({
      token,
      refreshToken,
      user: {
        id_persona: usuario.id_persona,
        nombre: usuario.nombre, // ✅ agregar esta línea
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// --------------------------------------
// REFRESH TOKEN
// --------------------------------------
export const refreshToken = async (req, res) => {
  console.log("------------controller: refreshToken ------------");
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token requerido" });
  }

  try {
    const decoded = auth.verifyRefreshToken(refreshToken);
    const usuarios = await sseguridad.findById(decoded.id_persona);

    if (!usuarios[0]) {
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

    const token = auth.generateToken(usuarios[0]);
    res.json({
      token,
      user: {
        id_persona: usuarios[0].id_persona,
        email: usuarios[0].email,
        rol: usuarios[0].rol,
      },
    });
  } catch (err) {
    console.error("Error en refreshToken:", err);
    res.status(500).json({ error: "Error validando token" });
  }
};

// --------------------------------------
// REGISTRO DE NUEVOS USUARIOS
// --------------------------------------
export const register = async (req, res) => {
  console.log("------------controller: register ------------");
  const { nombre, email, password } = req.body;

  try {
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Verificar si ya existe el correo
    const existe = await sseguridad.findByEmail(email);
    if (existe.length > 0) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await sseguridad.registrarUsuario({
      nombre,
      email,
      password: hashedPassword,
      rol: "CLIENTE",
    });

    // Generar tokens
    const token = auth.generateToken(nuevoUsuario);
    const refreshToken = auth.generaterefreshToken(nuevoUsuario);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      token,
      refreshToken,
      user: {
        id_persona: nuevoUsuario.id_persona,
        nombre: nuevoUsuario.nombre, // ✅ agregar esta línea
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (err) {
    console.error("Error en register:", err);
    res.status(500).json({ error: "Error registrando usuario" });
  }
};
