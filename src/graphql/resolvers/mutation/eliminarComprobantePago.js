import Giro from "../../../models/Giro";

export const eliminarComprobantePago = async (_root, { id }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            return await Giro.findByIdAndUpdate(id, {
                comprobantePago: null
            }, function (error, rta) {
                if (error) console.error(`Ocurrio un error al intentar eliminar un comprobante de pago, el error es: ${error}`, "from eliminarComprobantePago.js");
                else if (rta) console.log(rta, "from eliminarComprobantePago.js");
            }).clone();
        } catch (error) {
            console.error(error, "from eliminarComprobantePago.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", "from eliminarComprobantePago.js");
        throw new Error("No estas autorizado!");
    }
}