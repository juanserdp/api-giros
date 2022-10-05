import Giro from "../../../../../models/Giro";
import { v4 as uuidv4 } from 'uuid';
import AuthorizationError from "../../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../../helpers/handleResponse";

export const crearComprobantePago = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR" ||
            context.rol === "OPERARIO")) {
        try {
            const giro = await Giro.findByIdAndUpdate(
                id,
                { comprobantePago: uuidv4() },
                (error, data) => handleResponse(error, data, "Crear Comprobante Pago"))
                .clone();
            if (giro) return giro;
            else throw new Error("No se puede crear el comprobante de pago");
        } catch (error) {
            throw new Error(error);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};