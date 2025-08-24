import _express from "express";
import * as cfile from '../controllers/file.controller.js'
const router= _express.Router();

router.post('/upload', cfile.upload);
router.post('/upload-producto', cfile.uploadProducto); // el que usarás
router.post('/uploadmem', cfile.uploadmem);
router.post('/copiar', cfile.copiar);


export default router;
