import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Configuracion from "../../../../models/Configuracion";

export const editarConfiguracion = async (root, {
    asesor,
    configuracion
}, context) => {
    if (context.autorizacion &&
        (context.rol === "ADMINISTRADOR" ||
            context.rol === "ASESOR")) {
        try {
            const configuracionData = await Configuracion.find(
                { asesor },
                (error, data) => handleResponse(error, data, "Editar Configuracion"))
                .clone();
            if (configuracionData[0]) {
                const { _id } = configuracionData[0];
                const configuracionEditada = await Configuracion.findByIdAndUpdate(
                    _id, 
                    configuracion,
                    { new: true },
                    (error, data) => handleResponse(error, data, "Editar Configuracion"))
                    .clone();
                if (configuracionEditada) return configuracionEditada;
                else throw new Error("No se pudo editar la configuracion!")
            }
            else throw new Error("No se encontro la configuracion!")
        } catch (error) {
            throw new Error(error);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};

