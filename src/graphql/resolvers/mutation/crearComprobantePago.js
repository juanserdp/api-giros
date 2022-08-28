import Giro from "../../../models/Giro";
import { v4 as uuidv4 } from 'uuid';

export const crearComprobantePago = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            return await Giro.findByIdAndUpdate(id, {
                comprobantePago: uuidv4()
            }, function (error, rta) {
                if (error) console.error(`Ocurrio un error al intentar crear un comprobante de pago, el error es: ${error}`, "from crearComprobantePago.js");
                else if (rta) console.log(rta, "from crearComprobantePago.js");
            }).clone();
        } catch (error) {
            console.error(error, "from crearComprobantePago.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", "from crearComprobantePago.js");
        throw new Error("No estas autorizado!");
    }
}