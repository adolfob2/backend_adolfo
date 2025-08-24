// routes/usuarios.routers.js
import express from "express";
import * as cusuarios from "../controllers/usuarios.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Listar/obtener usuarios: normalmente ADMIN (ajusta si quieres abrirlo)
router.get("/",    authMiddleware(["ADMIN"]), cusuarios.getAll);
router.get("/:id", authMiddleware(["ADMIN"]), cusuarios.getById);

// Crear/actualizar/eliminar usuarios: ADMIN
router.post("/",      authMiddleware(["ADMIN"]), cusuarios.create);
router.put("/:id",    authMiddleware(["ADMIN"]), cusuarios.update);
router.patch("/:id",  authMiddleware(["ADMIN"]), cusuarios.update);
router.delete("/:id", authMiddleware(["ADMIN"]), cusuarios.deletes);

export default router;
