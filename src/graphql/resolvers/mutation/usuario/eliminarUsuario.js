import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Usuario from "../../../../models/Usuario";

export const eliminarUsuario = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            const usuarioEliminado = await Usuario.findByIdAndDelete(id);
            if (usuarioEliminado) return usuarioEliminado;
            else throw new Error("No se pudo eliminar el usuario!");
        } catch (error) {
            throw new Error(error);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
}