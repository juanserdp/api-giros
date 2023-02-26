import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Asesor from "../../../../models/Asesor";

export const obtenerTasaAdmin = async (_root, _args, context) => {
    if (context.autorizacion &&
        (context.rol === "USUARIO" ||
            context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            const admin = await Asesor.find(
                { numeroDocumento: "admin" },
                (error, data) => handleResponse(error, data, "ObtenerTasa del Admin"))
                .clone();
            if (admin[0]) return admin[0] ;
            else throw new Error("No se pudo obtener el admin!");
        }
        catch (e) {
            throw new Error(e);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
}