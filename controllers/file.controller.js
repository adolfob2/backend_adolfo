import * as sfile from "../services/file.service.js";

export const upload = function(req, res){
    console.log("-------------controller-------------");
    sfile.upload(req, res);

}

export const uploadProducto = (req, res) => sfile.uploadProducto(req, res);

export const download = async (req, res) => {
  const ruta = await scatalogo.downloadArchivo(req.params.id);
  if (!ruta) return res.status(404).json({ error: 'Producto sin imagen' });
  return res.download(ruta);
};

export const uploadmem = function(req, res) {
    console.log("------------controller------------");
    sfile.uploadmem(req, res);
}

export const copiar = function(req, res) {
    console.log("------------controller------------");
    if(sfile.copiar(req.body.carpeta, req.body.filename)){
        res.json({mensaje:"archivo copiado"});
    }else{
        res.status(500).json({"error":"no se pudo copiar los archivos"});
    }
}

