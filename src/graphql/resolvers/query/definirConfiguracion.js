import AuthorizationError from "../../../errors/AuthorizationError";
import Configuracion from "../../../models/Configuracion";

export const definirConfiguracion = async (root,{
        buzon,
        valorMinimoGiro,
        valorMinimoRecarga
    }, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR") {
        try {
            const configuracion = new Configuracion({
                buzon,
                valorMinimoGiro,
                valorMinimoRecarga
            });
            configuracion.save(function (error, data) {
                if (error) console.error("No se pudo guardar la configuacion!", " from definirConfiguracion.js");
                else if (data) console.log("La configuracion se guardo correctamente: ", data, " from definirConfiguracion.js");
            });
            if(!configuracion) throw new Error("No se guardo la configuracion!");
            else return configuracion;
        } catch (error) {
            console.error("Ocurrio un error: ", error, " from definirConfiguracion.js");
            throw new Error(error);
        };
    }
    else {
        console.error("No estas autorizado!", " from definirConfiguracion.js");
        throw new AuthorizationError("No estas autorizado!");
    };
};