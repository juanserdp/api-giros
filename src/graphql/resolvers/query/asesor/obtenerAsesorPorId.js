import Asesor from "../../../../models/Asesor";

export const obtenerAsesorPorId = async (_root, {id}, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            const asesor = await Asesor.findById(id).populate("usuarios");
            console.log(asesor.populated("usuarios"));
            return asesor;
            // if(asesor) return asesor;
            // else throw new Error(`Ocurrio un error al intentar obtener todos los asesores`, " from obtenerAsesoresPorId.js");
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