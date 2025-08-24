// routes/pedidos.routers.js
/*import express from "express";
import * as cpedidos from "../controllers/pedidos.controller.js";
// Si vas a proteger rutas, descomenta la siguiente línea y asegúrate que devuelve un middleware.
// import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// OJO: pasa referencias, SIN paréntesis
router.get("/", cpedidos.getAll);
router.get("/:id", cpedidos.getById);

// Si aún no tienes authMiddleware listo, déjalas sin protección
router.post("/", cpedidos.create);
router.put("/:id", cpedidos.update);
router.patch("/:id", cpedidos.update);
router.delete("/:id", cpedidos.deletes);

export default router;*/

// routes/pedidos.routers.js
import express from "express";
import * as cpedidos from "../controllers/pedidos.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Solo ADMIN ve todos los pedidos
router.get("/", authMiddleware(["ADMIN"]), cpedidos.getAll);

// Ver un pedido: ADMIN o el dueño del pedido (ver helper abajo)
router.get("/:id", authMiddleware(["ADMIN","CLIENTE"]), cpedidos.getById);

// Crear pedido: cualquier usuario logueado (CLIENTE o ADMIN)
router.post("/", authMiddleware(["CLIENTE","ADMIN"]), cpedidos.create);

// Opcional: restringe update/delete (ADMIN o dueño, según tu regla)
router.put("/:id", authMiddleware(["ADMIN","CLIENTE"]), cpedidos.update);
router.delete("/:id", authMiddleware(["ADMIN","CLIENTE"]), cpedidos.deletes);

export default router;

