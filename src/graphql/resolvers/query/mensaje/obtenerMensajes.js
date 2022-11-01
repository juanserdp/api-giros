import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Mensaje from "../../../../models/Mensaje";

export const obtenerMensajes = async (_root, _args, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR" ||
        context.rol === "ASESOR" ||
        context.rol === "USUARIO" ||
        context.rol === "OPERARIO") {
        try {
            const mensajes = await Mensaje.find(
                {},
                (error, data) => handleResponse(error, data, "Obtener Mensajes"))
                .clone();
            if (mensajes) return mensajes;
            else throw new Error("Ocurrio un error al intentar obtener todos los mensajes");
        }
        catch (e) {
            throw new Error(e);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};