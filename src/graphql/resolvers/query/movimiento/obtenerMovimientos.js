import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Movimiento from "../../../../models/Movimiento";

export const obtenerMovimientos = async (_root, _args, context) => {
    if(context.autorizacion){
        try {
            const movimientos = await Movimiento.find(
                {},
                (error, data) => handleResponse(error, data, "Obtener Movimientos"))
                .clone();
            if (movimientos) return movimientos;
            else throw new Error(`Ocurrio un error al intentar obtener todos los movimientos`);
        }
        catch (e) {
            throw new Error(e);
        };
    }
}