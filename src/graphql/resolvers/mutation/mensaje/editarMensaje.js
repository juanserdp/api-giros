import Mensaje from "../../../../models/Mensaje";
import { handleResponse } from "../../../../helpers/handleResponse";
import AuthorizationError from "../../../../errors/AuthorizationError";


export const editarMensaje = async (_root, { id, mensaje }, context) => {
    if (context.autorizacion &&
        (context.rol === "ADMINISTRADOR")) {
        try {
            mensaje.fechaUltimaModificacion = (new Date()).toLocaleDateString();
            const mensajeEditado = await Mensaje.findByIdAndUpdate(
                id,
                mensaje,
                { new: true },
                (error, data) => handleResponse(error, data, "Editar Mensaje"))
                .clone();
            if (mensajeEditado) return mensajeEditado;
            else throw new Error("No se pudo editar el mensaje");
        } catch (error) {
            throw new Error(error);
        };
    }
    else throw new AuthorizationError("No estas autorizado!");
}