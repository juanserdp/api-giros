import Giro from "../../../../models/Giro";

export const obtenerGiroPorId = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "USUARIO" ||
            context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            let giro = await Giro.findById(id, function (error, rta) {
                if (error) console.error(`Ocurrio un error interno de mongo al intentar obtener el giro con id: ${id}, el error es: ${error}`, "from obtenerGiroPorId.js");
                else if (rta) console.log(rta, "from obtenerGiroPorId.js");
            }).clone();
            if (giro) return giro;
            throw new Error(`Ocurrio un error al intentar obtener el giro con id: ${id}, porfavor revise que el id proporcionado exista.`);
        }
        catch (e) {
            console.error(e.message, "from obtenerGiroPorId.js");
            throw new Error(e);
        }
    }
    else {
        console.error("No estas autorizado!", "from obtenerGiroPorId.js");
        throw new Error("No estas autorizado!");
    }
}