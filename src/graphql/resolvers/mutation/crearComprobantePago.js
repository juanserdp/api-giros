import Giro from "../../../models/Giro";
import { v4 as uuidv4 } from 'uuid';

export const crearComprobantePago = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.uid === "admin" ||
        context.rol === "asesor")) {
        try {
            return await Giro.findByIdAndUpdate(id, {
                comprobantePago: uuidv4()
            }, function (err, doc) {
                if (err) return { error: `Hubo un error al intentar crear el comprobante de pago al giro con id: ${id}` };
                else console.log(doc);
            }).clone();
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!");
        throw new Error("No estas autorizado!");
    }
}