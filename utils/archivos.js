import { promises as fs } from "fs";
import path from "path";

export const copiarArchivos = async function (carpeta, filename) {
  try {
    const data = await fs.readFile(path.join(carpeta, filename), "utf8");
    console.log(data);
    await fs.writeFile(path.join(carpeta, "copia-" + filename), data);
    console.log("Archivo copiado");
    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
};

export const getArchivo = function (filename) {
  try {
    const rutaArchivo = path.join("./uploads", filename);
    console.log(rutaArchivo);
    return rutaArchivo;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
};
