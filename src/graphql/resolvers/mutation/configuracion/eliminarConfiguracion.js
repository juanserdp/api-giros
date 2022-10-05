import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Configuracion from "../../../../models/Configuracion";

export const eliminarConfiguracion = async (root, {
    asesor
}, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR") {
        try {
            const configuacionData = await Configuracion.find(
                { asesor },
                (error, data) => handleResponse(error, data, "Eliminar Configuracion"))
                .clone();
            if (configuacionData) {
                const { _id } = configuacionData;
                const configuracionEliminado = await Configuracion.findByIdAndDelete(_id);
                if (configuracionEliminado) return configuracionEliminado;
                else return null;
                // throw new Error("No se pudo eliminar la configuracion!");
            }
            else throw new Error("No se pudo obtener la configuracion!");
        } catch (e) {
            throw new Error(e);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};