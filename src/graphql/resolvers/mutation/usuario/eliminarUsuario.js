import Usuario from "../../../../models/Usuario";

export const eliminarUsuario = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            let rtaUsuarioDelete;
            if(rtaUsuarioDelete = await Usuario.findByIdAndDelete(id, function (err, doc) {
                if (error) console.error(`Hubo un error al intentar editar el usuario con id: ${id}. error: ${error} `, " from eliminarUsuario.js");
                else if (doc) console.log("Usuario editado: ", doc, " from eliminarUsuario.js");
            }).clone()) return rtaUsuarioDelete;
        } catch (error) {
            console.error(error, " from eliminarUsuario.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from eliminarUsuario.js");
        throw new Error("No estas autorizado!");
    }
}