import Usuario from "../../../../models/Usuario";
import bycript from "bcrypt";
import Asesor from "../../../../models/Asesor";
import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import DuplicationError from "../../../../errors/DuplicationError";
import { validarClave } from "../../../../helpers/validarClave";

const saltRounds = 12;
const salt = bycript.genSaltSync(saltRounds);

export const crearUsuario = async (_root, {
    asesor,
    nombres,
    apellidos,
    tipoDocumento,
    numeroDocumento,
    clave,
    saldo,
    capacidadPrestamo,
    tasaVenta
}, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            validarClave(clave, (errores, clave) => {
                if (errores) throw new Error(errores.toString());
                else if (clave) console.log("La clave es segura!");
            });
            const noExisteUsuario = (await Usuario.find(
                { numeroDocumento },
                (error, data) => handleResponse(error, data, "Crear Usuario"))
                .clone()).length == 0;
            if (noExisteUsuario) {
                const usuario = new Usuario({
                    asesor,
                    nombres,
                    apellidos,
                    tipoDocumento,
                    numeroDocumento,
                    clave: bycript.hashSync(clave, salt),
                    saldo,
                    capacidadPrestamo,
                    tasaVenta
                });
                const response = await usuario.save();
                if (response) {
                    const { _id } = response;
                    const asesorRes = await Asesor.findById(asesor);
                    if (asesorRes) {
                        const asesorEditado = await Asesor.findByIdAndUpdate(
                            asesor,
                            { usuarios: [...asesorRes.usuarios, _id] },
                            (error, asesor) => handleResponse(error, asesor, "Crear Usuario"))
                            .clone();
                        if (asesorEditado) return response;
                        else throw new Error("No se pudo agregar el usuario al vector de usuarios del asesor!");
                    }
                    else throw new Error("No se pudo obtener el vector de usuarios del asesor!");
                }
                else throw new Error("No se pudo crear el usuario!");
            }
            else throw new DuplicationError("El usuario ya existe!");
        } catch (error) {
            throw new Error(error);
        };
    }
    else throw new AuthorizationError("No estas autorizado!");
};