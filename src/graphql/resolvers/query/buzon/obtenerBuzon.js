import AuthorizationError from "../../../../errors/AuthorizationError";
import Configuracion from "../../../../models/Configuracion";

export const obtenerBuzon = async (_root, _args, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR") {
        try {
            const configuacion = await Configuracion.find({},function(error, data){
                if(error) console.error("No se pudo otener la configuracion", " from obtenerConfiguracion.js");
                else if(data[0]) console.log("Configuracion: ", data[0], " from obtenerConfiguracion.js");
            }).clone();
            if(!configuacion[0]) throw new Error("No se encontro la configuacion")
            else return configuacion[0];
        } catch (error) {
            console.error("Ocurrio un error: ", error, " from obtenerConfiguracion.js");
            throw new Error(error);
        };
    }
    else {
        console.error("No estas autorizado!", " from obtenerConfiguracion.js");
        throw new AuthorizationError("No estas autorizado!");
    };
};