import AuthorizationError from "../../../../errors/AuthorizationError";
import Giro from "../../../../models/Giro";

export const obtenerGiroPorId = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "USUARIO" ||
            context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            const giro = await Giro.findById(
                id,
                (error, data) => handleResponse(error, data, "Obtener Giro Por Id"))
                .clone();
            if (giro) return giro;
            throw new Error("No se pudo obtener el giro!");
        }
        catch (e) {
            throw new Error(e);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
}