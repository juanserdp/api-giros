import Asesor from "../../../../models/Asesor";

export const eliminarAsesor = async (_root, { id }, context) => {
    if (context.autorizacion &&
            context.rol === "ADMINISTRADOR") {
        try {
            let rtaAsesorDelete;
            if(rtaAsesorDelete = await Asesor.findByIdAndDelete(id, function (error, rta) {
                if (error) console.error(`Hubo un error al intentar eliminar el Asesor con id: ${id}. error: ${error} `, " from eliminarAsesor.js");
                else if (rta) console.log("Asesor eliminado: ", rta, " from eliminarAsesor.js");
            }).clone()) return rtaAsesorDelete;
        } catch (e) {
            console.error(e, " from eliminarAsesor.js");
            throw new Error(e);
        }
    }
    else {
        console.error("No estas autorizado!", " from eliminarAsesor.js");
        throw new Error("No estas autorizado!");
    }
}