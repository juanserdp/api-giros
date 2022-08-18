import Giro from "../../../models/Giro";

export const eliminarComprobantePago = async (_root, { id }, context) => {
    if (context.autorizacion && context.uid === "admin") {
        try {
            return await Giro.findByIdAndUpdate(id, {
                comprobantePago: null
            }, function (err, doc) {
                if (err) return { error: `Hubo un error al intentar eliminar el comprobante de pago al giro con id: ${id}` };
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