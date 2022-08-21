import Asesor from "../../../../models/Asesor";

export const obtenerAsesores = async (_root, _args, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR") {//context.autorizacion && context.uid === "admin"
        try {
            const asesores = await Asesor.find({}, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar obtener todos los asesores, el error es: ${error}`, " from obtenerAsesores.js");
                else if (rta) console.log(rta, " from obtenerAsesores.js");
            }).clone().populate("usuarios");
            if (asesores) return asesores;
            else throw new Error(`Ocurrio un error al intentar obtener todos los asesores`);
        }
        catch (e) {
            console.error(e, " from obtenerAsesores.js");
            throw new Error(e);
        }
    }
    else {
        console.error("No estas autorizado!", " from obtenerAsesores.js");
        throw new Error("No estas autorizado!");
    }
}