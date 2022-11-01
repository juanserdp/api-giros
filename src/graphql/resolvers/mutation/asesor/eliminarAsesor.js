import AuthorizationError from "../../../../errors/AuthorizationError";
import Asesor from "../../../../models/Asesor";

export const eliminarAsesor = async (_root, { id }, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR") {
        try {
            const asesorEliminado = await Asesor.findByIdAndDelete(id);
            if (asesorEliminado) return asesorEliminado;
            else throw new Error("No se pudo eliminar el asesor!");
        } catch (e) {
            throw new Error(e);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};