
// config/cors.js
import cors from "cors";                          // ← paquete, NO ./config/cors.js
import { FRONTEND_URL } from "../utils/constantes.js";  // ← con .js

console.log("CORS:", FRONTEND_URL);

const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export default cors(corsOptions);

