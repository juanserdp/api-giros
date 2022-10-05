import AuthorizationError from "../../../../errors/AuthorizationError";
import Configuracion from "../../../../models/Configuracion";

export const crearConfiguracion = async (root, {
    asesor,
    buzon,
    valorMinimoGiro,
    valorMinimoRecarga
}, context) => {
    if (context.autorizacion &&
        (context.rol === "ADMINISTRADOR" ||
            context.rol === "ASESOR")) {
        try {
            const configuracion = new Configuracion({
                asesor,
                buzon,
                valorMinimoGiro,
                valorMinimoRecarga
            });
            const response = await configuracion.save();
            if (response) return response;
            else throw new Error("No se pudo crear la configuracion!");
        } catch (error) {
            throw new Error(error);
        };
    }
    else  throw new AuthorizationError("No estas autorizado!");
};