import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Asesor from "../../../../models/Asesor";

export const obtenerAsesorPorId = async (_root, {id}, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            const asesor = await Asesor.findById(
                id,
                (error, data) => handleResponse(error, data, "Obtener Asesor Por Id"))
                .clone()
                .populate("usuarios");
            if(asesor) return asesor;
            else throw new Error("No se pudo obtener el asesor!");
        }
        catch (e) {
            throw new Error(e);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
}