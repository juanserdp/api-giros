import Usuario from "../../../../models/Usuario";
import bycript from "bcrypt";
const saltRounds = 12;
export const salt = bycript.genSaltSync(saltRounds);
export const crearUsuario = async (_root, { asesor, nombres, apellidos, tipoDocumento, numeroDocumento, clave, saldo, deuda, capacidadPrestamo, estado }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            /*/ VALIDAR QUE ESTE USUARIO NO SE HAYA REGISTRADO ANTES/*/
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
            let rtaUsuarioSave;
            if (rtaUsuarioSave = await usuario.save(null, function (error, doc) {
                if (error) console.error(`Hubo un error al intentar crear un usuario. error: ${error} `, " from crearUsuario.js");
                else if (doc) console.log("Nuevo usuario: ", doc, " from crearUsuario.js");
            })) return rtaUsuarioSave;
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
