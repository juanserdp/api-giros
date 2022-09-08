import AuthorizationError from "../../../../errors/AuthorizationError";
import Asesor from "../../../../models/Asesor";

export const recargarAsesor = async (root, { numeroDocumento, valorRecarga }, context) => {
    // VALIDACION DE AUTORIZACION
    if (context.autorizacion &&
        context.rol == "ADMINISTRADOR") {
        try {
            // OBTENGO EL ASESOR CON EL NUM DOC.
            const asesor = await Asesor.find({ numeroDocumento }, function (error, data) {
                if (error) console.error("No se pudo encontrar al asesor", " from recargarAsesor.js");
                else if (data[0]) console.log("Asesor: ", data[0], " from recargarAsesor.js")
            }).clone();
            // SI NO SE ENCUENTRA LANZA UNA ADVERTENCIA
            if (!asesor[0]) throw new Error(`El asesor con el numero de documento: ${numeroDocumento} no existe!`);
            // DE LO CONTRARIO PROSIGUE
            else {
                // OBTENGO EL ID DEL ASESOR PARA LUEGO MODIFICARLO
                const { _id, saldo } = asesor[0];
                //MODIFICO EL ASESOR Y AGREGO EL VALOR DE LA RECARGA AL SALDO DEL ASESOR
                const asesorEditado = await Asesor.findByIdAndUpdate(_id,
                    { ...asesor, saldo: saldo + valorRecarga },
                    { new: true }
                    , function (error, data) {
                        if (error) console.error("No se pudo editar el asesor", " from recargarAsesor.js");
                        else if (data) {
                            console.log("Asesor Editado: ", data, " from recargarAsesor.js");
                            return data;
                        }
                    }).clone();
                console.log("asesorEditado: ", asesorEditado);
                if (!asesorEditado) throw new Error("No se pudo editar el asesor");
                else return asesorEditado;
            }
        } catch (error) {
            console.error("Ocurrio un error: ", error, " from recargarAsesor.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from recargarAsesor.js");
        throw new AuthorizationError("No estas autorizado!");
    }
}