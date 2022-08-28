import Usuario from "../../../../models/Usuario";
import bycript from "bcrypt";

const saltRounds = 12;
const salt = bycript.genSaltSync(saltRounds);

export const crearUsuario = async (_root, { asesor, nombres, apellidos, tipoDocumento, numeroDocumento, clave, saldo, deuda, capacidadPrestamo, estado }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            /*/ VALIDAR QUE ESTE USUARIO NO SE HAYA REGISTRADO ANTES/*/
            return await Usuario.find({ numeroDocumento }, async function (error, rta) {
                    if (error) return console.error(`Ocurrio un error interno de mongo al intentar buscar entre todos los usuarios un usuario con ese documento, el error es: ${error}`, " from crearUsuario.js");
                    else if (rta[0]) {
                        console.log("Este usuario ya existe: ", rta, " from crearUsuario.js");
                        throw new Error("El usuario ya existe!");
                    }
                    else if (rta.length == 0) {
                        const usuario = new Usuario({
                            asesor,
                            nombres,
                            apellidos,
                            tipoDocumento,
                            numeroDocumento,
                            clave: bycript.hashSync(clave, salt),
                            saldo,
                            deuda,
                            capacidadPrestamo,
                            estado
                        });
                        return await usuario.save();
                    }
            }).clone();
        } catch (error) {
            console.error(error, " from crearUsuario.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from crearUsuario.js");
        throw new Error("No estas autorizado!");
    }
}
