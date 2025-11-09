// config/sequelize.js
import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const orm = new Sequelize(
  process.env.DB_NAME || "limpieza_pro",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    pool: { max: 2, idle: 10000, acquire: 60000 },
    logging: false, // quita ruido en consola
  }
);

export default orm;

// (opcional pero útil) prueba de conexión en el arranque
(async () => {
  try {
    await orm.authenticate();
    console.log("✅ Conexión a MySQL establecida correctamente.");
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error.message);
  }
})();
