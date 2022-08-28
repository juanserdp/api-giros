import Giro from "../../../../models/Giro";

export const eliminarGiro = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            return await Giro.findByIdAndDelete(id, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar eliminar el giro con id: ${id}, el error es: ${error}`, " from eliminarGiro.js");
                else if (rta) console.log(rta, " from eliminarGiro.js");
            }).clone();
        } catch (error) {
            console.error(error, " from eliminarGiro.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from eliminarGiro.js");
        throw new Error("No estas autorizado!");
    }
}