

// app.js
import express from "express";
import bodyParser from "body-parser";         // (o usa express.json(), como prefieras)
import api from "./routes.js";
import cors from "./config/cors.js";          // ← tu config CORS centralizada
import PUERTO from "./utils/constantes.js";   // ← 4001

const app = express();

app.use(cors);                // ← CORS primero
app.use(bodyParser.json());   // (alternativa: app.use(express.json()))
app.use("/api/v1", api);      // ← luego tus rutas

app.listen(PUERTO, () => {
  console.log("Listening on " + PUERTO);
});


