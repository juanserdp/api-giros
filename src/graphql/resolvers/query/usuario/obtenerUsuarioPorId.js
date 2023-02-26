import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Usuario from "../../../../models/Usuario";

export const obtenerUsuarioPorId = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "USUARIO" ||
            context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            const usuario = await Usuario.findById(
                id, 
                (error, data) => handleResponse(error, data, "Obtener Usuario Por Id"))
                .clone()
                .populate("giros")
                .populate("asesor")
                .populate("movimientos");
            if (usuario) return usuario;
            else throw new Error("No se pudo obtener el usuario!");
        }
        catch (e) {
            throw new Error(e);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
}