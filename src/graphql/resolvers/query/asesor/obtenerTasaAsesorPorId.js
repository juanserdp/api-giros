import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Asesor from "../../../../models/Asesor";
import Usuario from "../../../../models/Usuario";

export const obtenerTasaAsesorPorId = async (_root, _args, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "USUARIO" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            if(context.rol === "USUARIO"){
                const usuarioInfo = await Usuario.findById(
                    context.uid,
                    (error, data) => handleResponse(error, data, "Obtener Tasa Asesor Por Id"))
                    .clone();
                const asesor = await Asesor.findById(
                    usuarioInfo.asesor,
                    (error, data) => handleResponse(error, data, "Obtener Tasa Asesor Por Id"))
                    .clone();
                if (asesor) return asesor;
                else throw new Error("No se pudo obtener el asesor!");
            }
            else if(context.rol === "ASESOR" || context.rol === "ADMINISTRADOR"){
                const asesor = await Asesor.findById(
                    context.uid,
                    (error, data) => handleResponse(error, data, "Obtener Tasa Asesor Por Id"))
                    .clone();
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