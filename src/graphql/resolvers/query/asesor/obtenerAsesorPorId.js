import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Asesor from "../../../../models/Asesor";

export const obtenerAsesorPorId = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            if (id === "admin") {
                const admin = await Asesor.find(
                    { numeroDocumento: "admin" },
                    (error, data) => handleResponse(error, data, "Obtener Asesor Por Id"))
                    .clone();
                if (admin[0]) return admin[0];
                else throw new Error("No se pudo obtener el admin!");
            }
            else {
                const asesor = await Asesor.findById(
                    id,
                    (error, data) => handleResponse(error, data, "Obtener Asesor Por Id"))
                    .clone()
                    .populate("usuarios")
                    .populate("movimientos");
                if (asesor) return asesor;
                else throw new Error("No se pudo obtener el asesor!");
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
}