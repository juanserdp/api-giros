import Usuario from "../../../../models/Usuario";

export const obtenerUsuarios = async (_root, _args, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR") {
        try {
            let usuarios = await Usuario.find({}, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar obtener todos los usuarios, el error es: ${error}`, " from obtenerUsuarios.js");
                else if (rta) console.log(rta, " from obtenerUsuarios.js");
            }).clone().populate("giros").populate("asesor");
            if (usuarios) return usuarios;
            throw new Error(`Ocurrio un error al intentar obtener todos los usuarios`);
        }
        catch (e) {
            console.error(e, " from obtenerUsuarios.js");
            throw new Error(e);
        }
    }
    else {
        console.error("No estas autorizado!", " from obtenerUsuarios.js");
        throw new Error("No estas autorizado!");
    }
}