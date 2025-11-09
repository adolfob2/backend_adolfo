// app.js
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import api from "./routes.js";
import cors from "./config/cors.js";
import PUERTO from "./utils/constantes.js";
import helmet from "helmet";

const app = express();

app.use('/uploads', express.static('uploads'));


// ----- CORS y seguridad: deben ir antes de servir estáticos -----
app.use(cors);

app.use(helmet());
app.use(helmet.frameguard({ action: "deny" }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);


// Middleware explícito como respaldo y verificación
app.use((req, res, next) => {
  // LOG para confirmar ejecución
  console.log(`[SEC-MW] applying security headers for ${req.path}`);

  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none';"
  );
  next();
});
// ---------------------------------------------------------------

// servir estáticos después de las cabeceras
app.use(express.static(path.join(process.cwd(), "public")));

app.use(bodyParser.json());
app.use("/api/v1", api);

app.listen(PUERTO, () => {
  console.log("Listening on " + PUERTO);
});


// app.js (modo NO protegido — uso solo para prueba)

/*import express from "express";
import path from "path";
import bodyParser from "body-parser";
import api from "./routes.js";
import cors from "./config/cors.js";
import PUERTO from "./utils/constantes.js";
import helmet from "helmet";

const app = express();

app.use(cors);

// opcional: no aplicamos frameguard ni CSP para esta prueba
app.use(helmet()); 
// no usar frameguard ni CSP aquí

// comentar middleware que fuerza cabeceras de frame
// app.use((req,res,next) => { ... res.setHeader("X-Frame-Options","DENY"); ... })

// servir estáticos
app.use(express.static(path.join(process.cwd(), "public")));

app.use(bodyParser.json());
app.use("/api/v1", api);

app.listen(PUERTO, () => {
  console.log("Listening on " + PUERTO);
});
*/