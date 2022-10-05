import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Usuario from "../../../../models/Usuario";

export const obtenerUsuariosPorIdAsesor = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            const usuarios = await Usuario.find(
                { asesor: id },
                (error, data) => handleResponse(error, data, "Obtener Usuarios Por Id Asesor"))
                .clone()
                .populate("giros")
                .populate("asesor");
            if (usuarios) return usuarios;
            else throw new Error("Ocurrio un error al intentar obtener todos los usuarios del asesor");
        }
        catch (e) {
            throw new Error(e);
        };
    }
    else throw new AuthorizationError("No estas autorizado!");
};