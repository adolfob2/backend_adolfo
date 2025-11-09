// routes.js
import express from "express";

// Importar todas las rutas específicas
import catalogoRouter from "./routes/catalogo.routers.js";
import usuariosRouter from "./routes/usuarios.routers.js";
import pedidosRouter from "./routes/pedidos.routers.js";
import seguridadRouter from "./routes/seguridad.router.js"; // ✅ sin la “s”
import fileRouter from "./routes/file.routes.js";

const router = express.Router();

// Prefijos de API
router.use("/catalogo", catalogoRouter);
router.use("/usuarios", usuariosRouter);
router.use("/pedidos", pedidosRouter);
router.use("/seguridad", seguridadRouter); // ✅ coincide con el import
router.use("/file", fileRouter);

export default router;
