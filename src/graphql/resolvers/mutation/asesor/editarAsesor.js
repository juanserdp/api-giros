import Asesor from "../../../../models/Asesor";
import bycript from "bcrypt";
import { handleResponse } from "../../../../helpers/handleResponse";
import AuthorizationError from "../../../../errors/AuthorizationError";
import DuplicationError from "../../../../errors/DuplicationError";
import { validarClave } from "../../../../helpers/validarClave";

const saltRounds = 12;
const salt = bycript.genSaltSync(saltRounds);

export const editarAsesor = async (_root, { id, asesor }, context) => {
    if (context.autorizacion &&
        (context.rol === "ADMINISTRADOR" ||
            context.rol === "ASESOR")) {
        try {
            const { numeroDocumento, clave } = asesor;
            if (clave) {
                validarClave(clave, (errores, clave) => {
                    if (errores) throw new Error(errores.toString());
                    else if (clave) console.log("La clave es segura!");
                });
            };
            if (clave) asesor.clave = bycript.hashSync(clave, salt);
            if (numeroDocumento) {
                const asesor = await Asesor.find(
                    { numeroDocumento },
                    (error, data) => handleResponse(error, data, "Editar Asesor"))
                    .clone();
                if (asesor.length > 0) throw new DuplicationError("Ya existe un asesor con ese numero de documento!");
            };
            const asesorEditado = await Asesor.findByIdAndUpdate(
                id,
                asesor,
                { new: true },
                (error, data) => handleResponse(error, data, "Editar Asesor"))
                .clone();
            if (asesorEditado) return asesorEditado;
            else throw new Error("No se pudo editar el asesor");
        } catch (error) {
            throw new Error(error);
        };
    }
    else throw new AuthorizationError("No estas autorizado!");
}