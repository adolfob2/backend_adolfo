import express from "express";
import rcatalogo  from "./routes/catalogo.routers.js";
import rpedidos   from "./routes/pedidos.routers.js";
import rseguridad from "./routes/seguridad.router.js";
import rusuarios  from "./routes/usuarios.routers.js";
import rfile      from "./routes/file.routes.js";

const router = express.Router();

router.use("/catalogo",  rcatalogo);
router.use("/pedidos",   rpedidos);
router.use("/seguridad", rseguridad);
router.use("/usuarios",  rusuarios);
router.use("/archivos",  rfile);

export default router;
