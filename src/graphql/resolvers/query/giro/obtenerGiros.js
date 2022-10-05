import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Giro from "../../../../models/Giro";

export const obtenerGiros = async (_root, _args, context) => {
    if (context.autorizacion &&
        (context.rol === "ADMINISTRADOR" ||
        context.rol === "OPERARIO")) {
        try {
            const giros = await Giro.find(
                {},
                (error, data) => handleResponse(error, data, "Obtener Giros"))
                .clone();
            if (giros) return giros;
            else throw new Error(`Ocurrio un error al intentar obtener todos los giros`);
        }
        catch (e) {
            throw new Error(e);
        };
    }
    else throw new AuthorizationError("No estas autorizado!");
};