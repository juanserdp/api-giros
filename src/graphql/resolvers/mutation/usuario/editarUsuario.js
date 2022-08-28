import Usuario from "../../../../models/Usuario";
import bycript from "bcrypt";

const saltRounds = 12;
const salt = bycript.genSaltSync(saltRounds);

export const editarUsuario = async (_root, { id, nombres, apellidos, tipoDocumento, numeroDocumento, clave, saldo, deuda, capacidadPrestamo, estado }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            /*/ VALIDAR QUE EL TIPO DE DOCUMENTO NO SE REPITA/*/
            let user = await Usuario.find({ numeroDocumento }, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar buscar entre todos los usuarios un usuario con ese documento, el error es: ${error}`, " from editarUsuario.js");
                else if (rta[0]) console.log("Este usuario ya existe: ", rta, " from editarUsuario.js");
            }).clone();
            if (user.length == 0 || user[0].id === id) {
                let rtaUsuarioUpdate = await Usuario.findByIdAndUpdate(id, {
                    nombres,
                    apellidos,
                    tipoDocumento,
                    numeroDocumento,
                    clave,
                    saldo,
                    deuda,
                    capacidadPrestamo,
                    estado
                }, function (error, doc) {
                    if (error) console.error(`Hubo un error al intentar editar el usuario con id: ${id}. error: ${error} `, " from editarUsuario.js");
                    else if (doc) console.log("Usuario editado: ", doc, " from editarUsuario.js");
                }).clone();
                if (rtaUsuarioUpdate) return rtaUsuarioUpdate;
            }
            else throw new Error("El usuario ya existe!");
        } catch (error) {
            console.error(error, " from editarUsuario.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from editarUsuario.js");
        throw new Error("No estas autorizado!");
    }
    if (context.autorizacion &&
        context.rol === "USUARIO") {
        try {
            /*/ VALIDAR QUE EL TIPO DE DOCUMENTO NO SE REPITA/*/
            let user = await Usuario.find({ numeroDocumento }, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar buscar entre todos los usuarios un usuario con ese documento, el error es: ${error}`, " from editarUsuario.js");
                else if (rta[0]) console.log("Este usuario ya existe: ", rta, " from editarUsuario.js");
            }).clone();
            if (user[0].id === id) {
                let rtaUsuarioUpdate = await Usuario.findByIdAndUpdate(id, {
                    nombres,
                    apellidos,
                    tipoDocumento,
                    numeroDocumento,
                    clave,
                }, function (error, doc) {
                    if (error) console.error(`Hubo un error al intentar editar el usuario con id: ${id}. error: ${error} `, " from editarUsuario.js");
                    else if (doc) console.log("Usuario editado: ", doc, " from editarUsuario.js");
                }).clone();
                if (rtaUsuarioUpdate) return rtaUsuarioUpdate;
            }
            else throw new Error("El usuario ya existe!");
        } catch (error) {
            console.error(error, " from editarUsuario.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from editarUsuario.js");
        throw new Error("No estas autorizado!");
    }
}