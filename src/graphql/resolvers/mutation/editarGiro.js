import Giro from "../../../models/Giro";

export const editarGiro = async (_, { id, nombres, apellidos, tipoDocumento, numeroDocumento, banco, tipoCuenta, numeroCuenta, valorGiro, comprobantePago }) => {
    if (true) {
        try {
            return await Giro.findByIdAndUpdate(id, {
                nombres,
                apellidos,
                tipoDocumento,
                numeroDocumento,
                banco, 
                tipoCuenta,
                numeroCuenta,
                valorGiro,
                comprobantePago
            }, function (err, doc) {
                if (err) return { error: `Hubo un error al intentar editar el giro con id: ${id}` };
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