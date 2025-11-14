
// config/cors.js
/*import cors from "cors";                          // ← paquete, NO ./config/cors.js
import { FRONTEND_URL } from "../utils/constantes.js";  // ← con .js

console.log("CORS:", FRONTEND_URL);

const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export default cors(corsOptions);
*/

// config/cors.js
/*import cors from "cors";

const corsOptions = {
  origin: ["http://localhost:5173"], // frontend Vite
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors(corsOptions);
*/

// config/cors.js
/*import cors from "cors";

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

export default cors({
  origin: allowedOrigin,
  credentials: true,
});*/

import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "https://limpiezaproapp2.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite peticiones del backend (sin origin) y orígenes permitidos
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log("❌ CORS bloqueó:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

export default cors(corsOptions);
