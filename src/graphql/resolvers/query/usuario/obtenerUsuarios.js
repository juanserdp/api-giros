import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Usuario from "../../../../models/Usuario";

export const obtenerUsuarios = async (root, args, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR") {
        try {
            const usuarios = await Usuario.find(
                {},
                (error, data) => handleResponse(error, data, "Obtener Usuarios"))
                .clone()
                .populate("giros")
                .populate("asesor");
            if (usuarios) return usuarios;
            throw new Error(`Ocurrio un error al intentar obtener todos los usuarios`);
        }
        catch (e) {
            throw new Error(e);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};