import _multer from "multer";

const storage = _multer.memoryStorage();

function getExtension(filename) {
    return filename.substring(filename.lastIndexOf('.'));
}

const fileFilter = (req, file, cb) => {
    //const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const allowedTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/gif'
        ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Error: Tipo de archivo invalido'), false);
    }
};

export const upload = function(req, res) {
    console.log("------------multer------------");
    const uploadFile = _multer({ storage:storage, fileFilter: fileFilter, 
        limits:{fileSize:5*1024*1024}
     });
    uploadFile.single('archivo')(req, res, (err) => {
        // todo correcto
        if (!err) {
            console.log(req.file);
            if (!req.file) {
                return res.status(400).json({ error: 'No se encontro archivo a cargar'});
            }
            console.log(req.file.buffer);
            console.log(req.file.mimetype);
            res.json({ mensaje: 'Archivo cargado: ', file:req.file.originalname, extension:getExtension(req.file.originalname)});

        }else{
            console.log("Error de carga de archivo");
            console.log(err);
            // Error de Multer
            if (err instanceof _multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'Archivo demasiado pesado' });
                }
                return res.status(400).json({ error: err.message });
            }
            // Error desconocido
            return res.status(500).json({ error: 'Error de servidor' });
        }
    });
};
