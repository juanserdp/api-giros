import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Giros from "../../../../models/Giro";
import Usuario from "../../../../models/Usuario";
export const obtenerGirosPorUsuariosPorIdAsesor = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "USUARIO" ||
            context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR" ||
            context.rol === "OPERARIO")) {
        try {
            const usuarios = await Usuario.find(
                { asesor: id },
                (error, data) => handleResponse(error, data, "Obtener Giros Por Asesor"))
                .clone()
                .populate("giros");
            if (usuarios) {
                let girosAsesor = [];
                usuarios.map(usuario => {
                    if (usuario.giros.length > 0) girosAsesor = [...girosAsesor, ...usuario.giros];
                });
                if (girosAsesor) return girosAsesor;
                else throw new Error(`No se obtuvo todos los giros de los usuarios del asesor!`);
            }
            throw new Error(`Ocurrio un error al intentar obtener todos los usuarios`);
        }
        catch (e) {
            throw new Error(e);
        };
    }
    else throw new AuthorizationError("No estas autorizado!");
};