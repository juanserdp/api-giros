import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Asesor from "../../../../models/Asesor";

export const obtenerAsesores = async (_root, _args, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR") {
        try {
            const asesores = await Asesor.find(
                {},
                (error, data) => handleResponse(error, data, "Obtener Asesores"))
                .clone()
                .populate("usuarios");
            if (asesores) return asesores;
            else throw new Error(`Ocurrio un error al intentar obtener todos los asesores`);
        }
        catch (e) {
            throw new Error(e);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};