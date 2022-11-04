import Asesor from "../../../../models/Asesor";
import bycript from "bcrypt";
import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import DuplicationError from "../../../../errors/DuplicationError";
import { validarClave } from "../../../../helpers/validarClave";
const saltRounds = 12;
const salt = bycript.genSaltSync(saltRounds);
export const crearAsesor = async (_root, {
    nombres,
    apellidos,
    tipoDocumento,
    numeroDocumento,
    clave,
    saldo
}, context) => {
    if (context.autorizacion &&
        (context.rol === "ADMINISTRADOR")) {
        try {
            validarClave(clave, (errores, clave) => {
                if (errores) throw new Error(errores.toString());
                else if (clave) console.log("La clave es segura!");
            });
            const noExisteAsesor = (await Asesor.find(
                { numeroDocumento },
                (error, data) => handleResponse(error, data, "Crear Asesor"))
                .clone()).length == 0;
            if (noExisteAsesor) {
                const asesor = new Asesor({
                    nombres,
                    apellidos,
                    tipoDocumento,
                    numeroDocumento,
                    clave: bycript.hashSync(clave, salt),
                    saldo,
                    configuracion: {
                        buzon: [],
                        valorMinimoGiro: 1,
                        valorMinimoRecarga: 1
                    }
                });
                const response = await asesor.save();
                if (response) return response;
                else throw new Error("No se pudo crear el asesor!");
            }
            else throw new DuplicationError("El asesor ya existe!");
        } catch (error) {
            throw new Error(error);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};