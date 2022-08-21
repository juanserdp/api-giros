import Asesor from "../../../../models/Asesor";

export const obtenerAsesorPorId = async (_root, {id}, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            const asesores = await Asesor.findById(id, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar obtener todos los asesores, el error es: ${error}`, " from obtenerAsesoresPorId.js");
                else if(rta) console.log(rta);
            }).clone().populate("usuarios");
            if(asesores) return asesores;
            else throw new Error(`Ocurrio un error al intentar obtener todos los asesores`, " from obtenerAsesoresPorId.js");
        }
        catch (e) {
            console.error(e, " from obtenerAsesoresPorId.js");
            throw new Error(e);
        }
    }
    else {
        console.error("No estas autorizado!", " from obtenerAsesoresPorId.js");
        throw new Error("No estas autorizado!");
    }
}