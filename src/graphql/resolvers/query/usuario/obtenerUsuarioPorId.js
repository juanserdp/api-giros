import Usuario from "../../../../models/Usuario";

export const obtenerUsuarioPorId = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "USUARIO" ||
            context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            let usuario = await Usuario.findById(id, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar obtener el usuario con id: ${id}, el error es: ${error}`, "from obtenerUsuarioPorId.js")
                else if (rta) console.log(rta, "from obtenerUsuarioPorId.js");
            }).clone().populate("giros");
            if (usuario) return usuario;
            else throw new Error(`Ocurrio un error al intentar obtener el usuario con id: ${id}, porfavor revise que el id proporcionado exista.`);
        }
        catch (e) {
            console.error(e.message, "from obtenerUsuarioPorId.js");
            throw new Error(e);
        }
    }
    else {
        console.error("No estas autorizado!", "from obtenerUsuarioPorId.js");
        throw new Error("No estas autorizado!");
    }
}