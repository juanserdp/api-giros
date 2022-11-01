import AuthorizationError from "../../../../errors/AuthorizationError";
import Mensaje from "../../../../models/Mensaje";

export const eliminarMensaje = async (_root, { id }, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR") {
        try {
            const mensajeEliminado = await Mensaje.findByIdAndDelete(id);
            if (mensajeEliminado) return mensajeEliminado;
            else throw new Error("No se pudo eliminar el mensaje!");
        } catch (e) {
            throw new Error(e);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};