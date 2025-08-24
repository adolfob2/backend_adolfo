import _multer from "multer";
import  * as archmulter from '../config/archmulter.js';
import * as archmemoriamulter from '../config/archmemoriamulter.js';
import * as archivos from "../utils/archivos.js";

export const upload = function(req, res){
     console.log("-----------service---------");
     archmulter.upload(req, res);
}

export const uploadProducto = function (req, res) {
 console.log ("-------- service---------");
   archmulter.uploadProducto(req, res);

}

export const uploadmem = function(req, res) {
    console.log("------------service------------");
    archmemoriamulter.upload(req, res);
};

export const copiar = function(carpeta, filename) {
    console.log("------------service------------");
    return archivos.copiarArchivos(carpeta, filename);
};


