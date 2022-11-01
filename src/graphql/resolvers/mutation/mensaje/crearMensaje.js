import Mensaje from "../../../../models/Mensaje";
import AuthorizationError from "../../../../errors/AuthorizationError";

export const crearMensaje = async (_root, {
    mensaje,
}, context) => {
    if (context.autorizacion &&
        (context.rol === "ADMINISTRADOR")) {
        try {
            const nuevoMensaje = new Mensaje({
                mensaje,
                fechaCreacion: (new Date()).toLocaleDateString(),
                fechaUltimaModificacion: (new Date()).toLocaleDateString(),
            });
            const response = await nuevoMensaje.save();
            if (response) return response;
            else throw new Error("No se pudo crear el mensaje!");

        } catch (error) {
            throw new Error(error);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};