import Giro from "../../../../models/Giro";

export const eliminarGiro = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            const giroData = await Giro.findById(id);
            if (giroData) {
                const { estadoGiro } = giroData;
                if (estadoGiro == "COMPLETADO") {
                    const giroEliminado = await Giro.findByIdAndDelete(id);
                    if (giroEliminado) return giroEliminado;
                    else throw new Error("No se pudo eliminar el giro!");
                }
                else throw new Error(`No se pudo eliminar el giro porque su estado es: ${estadoGiro}!`)
            }
            else throw new Error("No se pudo obtener el giro para editar!");
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