import Usuario from "../../../../models/Usuario";

export const editarUsuario = async (_root, { id, nombres, apellidos, tipoDocumento, numeroDocumento, clave, saldo, deuda, capacidadPrestamo, estado }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            /*/ VALIDAR QUE EL TIPO DE DOCUMENTO NO SE REPITA/*/
            let rtaUsuarioUpdate;
            if (rtaUsuarioUpdate = await Usuario.findByIdAndUpdate(id, {
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
            }).clone()) return rtaUsuarioUpdate;
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
            let rtaUsuarioUpdate;
            if (rtaUsuarioUpdate = await Usuario.findByIdAndUpdate(id, {
                nombres,
                apellidos,
                tipoDocumento,
                numeroDocumento,
                clave,
            }, function (error, doc) {
                if (error) console.error(`Hubo un error al intentar editar el usuario con id: ${id}. error: ${error} `, " from editarUsuario.js");
                else if (doc) console.log("Usuario editado: ", doc, " from editarUsuario.js");
            }).clone()) return rtaUsuarioUpdate;
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