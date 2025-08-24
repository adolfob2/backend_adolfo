import * as sseguridad from "../services/seguridad.services.js";
import * as auth from "../config/auth.js";


export const login = function(req, res) {
    console.log("------------controller------------");
    const reqUsuario=req.body;
    console.log(reqUsuario);
    
    sseguridad.login(reqUsuario)
    .then(usuarios => {
        //console.log("... despues de scatalogo.login()");
        if(usuarios[0]){
            //... se valido el usuario correctamente ...
            if(usuarios[0].password==reqUsuario.password){
                let token=auth.generateToken(usuarios[0]);
                let refreshToken=auth.generaterefreshToken(usuarios[0]);
                console.log("token: "+token);
                console.log("refreshToken: "+refreshToken);
                res.json( { token, 
                            refreshToken, 
                        "user":{"id_persona":usuarios[0].id_persona, "email":usuarios[0].email, "rol":usuarios[0].rol}
                        } );
            }else{
                res.status(403).json( {"error":"Acceso no autorizado"} );
            }
        }
        else
            res.status(403).json( {"error":"Acceso no autorizado"} );
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({"error":"Error obteniendo registros"});
    });
};

export const refreshToken = function(req, res) {
    console.log("------------controller------------");
    const {refreshToken}=req.body;
    console.log(refreshToken);

    if (!refreshToken){
        return res.status(401).json({"error":"Refresh token requerido"});
    }

    const decoded = auth.verifyRefreshToken(refreshToken);
    console.log(decoded);

    sseguridad.findById(decoded.id_persona)
    .then(usuarios => {
        //console.log("... despues de scatalogo.login()");
        if(usuarios[0]){
            //... se valido el usuario correctamente ...
            let token=auth.generateToken(usuarios[0]);
            console.log("token: "+token);
            res.json( { token, 
                    "user":{"id_persona":usuarios[0].id_persona, "email":usuarios[0].email, "rol":usuarios[0].rol}
                    } );
        }
        else
            res.status(403).json( {"error":"Acceso no autorizado"} );
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({"error":"Error obteniendo registros"});
    });
};