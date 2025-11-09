

// routes/catalogo.routers.js
import express from "express";
import * as ccatalogo from "../controllers/catalogo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js"; // ← FIX

const router = express.Router();

/* 1) Rutas “específicas” primero (evita que '/:id' capture 'download') */
router.get("/download/:id", authMiddleware(), ccatalogo.download); // cualquier usuario logueado
router.post("/upload", authMiddleware(), ccatalogo.upload);        // cualquier usuario logueado
router.post("/reporte", ccatalogo.getReporte);   

// ✅ NUEVA RUTA
router.get('/categorias', ccatalogo.getCategorias);

router.get('/', ccatalogo.getAll);
router.get('/:id', ccatalogo.getById);

// Solo ADMIN
router.post('/',  authMiddleware(['ADMIN']), ccatalogo.create);
router.put('/:id', authMiddleware(['ADMIN']), ccatalogo.update);
router.patch('/:id', authMiddleware(['ADMIN']), ccatalogo.update);
router.delete('/:id', authMiddleware(['ADMIN']), ccatalogo.deletes);

router.post('/reporte', ccatalogo.getReporte); // reporte que invoca un store procedure

export default router;
