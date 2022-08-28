import Usuario from "../../../../models/Usuario";

export const obtenerUsuariosPorIdAsesor = async (_root, {id}, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            let usuarios = await Usuario.find({asesor: id}, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar obtener todos los usuarios por el id del asesor: ${id}, el error es: ${error}`, "from obtenerUsuariosPorIdAsesor.js");
                else if(rta) console.log(rta, "from obtenerUsuariosPorIdAsesor.js");
            }).clone();
            if(usuarios) return usuarios;
            throw new Error(`Ocurrio un error al intentar obtener todos los usuarios`, "from obtenerUsuariosPorIdAsesor.js");
        }
        catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }
    else {
        console.error("No estas autorizado!", "from obtenerUsuariosPorIdAsesor.js");
        throw new Error("No estas autorizado!");
    }
}