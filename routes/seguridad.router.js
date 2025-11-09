// routes/seguridad.router.js

import express from "express";
import * as cseguridad from "../controllers/seguridad.controller.js";

const router = express.Router();

router.post("/login", cseguridad.login);
router.post("/register", cseguridad.register);
router.post("/refresh", cseguridad.refreshToken);

export default router;
