import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Giro from "../../../../models/Giro";

export const editarGiro = async (_root, {
    id,
    giro
}, context) => {
    if (context.autorizacion &&
        (context.rol === "USUARIO" ||
            context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR" ||
            context.rol === "OPERARIO")) {
        try {
            const giroData = await Giro.findById(id);
            if (giroData) {
                const { estadoGiro } = giroData;
                if (estadoGiro === "PENDIENTE" ||
                    (estadoGiro === "EN PROCESO" && (context.rol === "ADMINISTRADOR" || context.rol === "ASESOR" || context.rol === "OPERARIO")) ||
                    (estadoGiro === "COMPLETADO" && (context.rol === "ADMINISTRADOR"))) {
                    const giroModificado = await Giro.findByIdAndUpdate(
                        id,
                        giro,
                        { new: true },
                        (error, data) => handleResponse(error, data, "Editar Giro"))
                        .clone();
                    if (giroModificado) return giroModificado;
                    else throw new Error("No se pudo editar el giro!");
                }
                else throw new Error(`No se pudo editar el giro porque su estado es: ${estadoGiro}!`)
            }
            else throw new Error("No se pudo obtener el giro para editar!");
        } catch (error) {
            throw new Error(error);
        };
    }
    else throw new AuthorizationError("No estas autorizado!");
}