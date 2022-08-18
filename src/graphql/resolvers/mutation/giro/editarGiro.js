import Giro from "../../../../models/Giro";

export const editarGiro = async (_root, { id, nombres, apellidos, tipoDocumento, numeroDocumento, banco, tipoCuenta, numeroCuenta, valorGiro}, context) => {
    if (context.autorizacion &&
        (context.uid === "admin" ||
        context.rol === "asesor")) {
        try {
            return await Giro.findByIdAndUpdate(id, {
                nombres,
                apellidos,
                tipoDocumento,
                numeroDocumento,
                banco, 
                tipoCuenta,
                numeroCuenta,
                valorGiro
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