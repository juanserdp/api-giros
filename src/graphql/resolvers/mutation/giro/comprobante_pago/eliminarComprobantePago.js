import Giro from "../../../../models/Giro";
import AuthorizationError from "../../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../../helpers/handleResponse";

export const eliminarComprobantePago = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR" ||
            context.rol === "OPERARIO")) {
        try {
            const giro = await Giro.findByIdAndUpdate(
                id,
                { comprobantePago: null },
                (error, data) => handleResponse(error, data, "Eliminar Comprobante Pago"))
                .clone();
            if (giro) return giro;
            else throw new Error("No se puedo eliminar el comprobante de pago");
        } catch (error) {
            throw new Error(error);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
}