import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Configuracion from "../../../../models/Configuracion";

export const obtenerConfiguraciones = async (_root, _args, context) => {
    if (context.autorizacion &&
        (context.rol === "ADMINISTRADOR" ||
            context.rol === "ASESOR" ||
            context.rol === "USUARIO")) {
        try {
            const configuaciones = await Configuracion.find(
                {}, 
                (error, data) => handleResponse(error, data, "Obtener Configuraciones"))
                .clone();
            if (configuaciones) return configuaciones;
            else throw new Error("No se encontro la configuacion")
        } catch (error) {
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from obtenerConfiguracion.js");
        throw new AuthorizationError("No estas autorizado!");
    }
}