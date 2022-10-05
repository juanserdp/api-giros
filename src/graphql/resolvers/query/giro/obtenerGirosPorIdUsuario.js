import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Giros from "../../../../models/Giro";
export const obtenerGirosPorIdUsuario = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "USUARIO" ||
            context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR" ||
            context.rol === "OPERARIO")) {
        try {
            const giros = await Giros.find(
                { usuario: id },
                (error, data) => handleResponse(error, data, "Obtener Giros Por Usuario"))
                .clone();
            if (giros) return giros;
            else throw new Error(`No se obtuvo todos los giros del usuario!`);
        }
        catch (e) {
            throw new Error(e);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
}