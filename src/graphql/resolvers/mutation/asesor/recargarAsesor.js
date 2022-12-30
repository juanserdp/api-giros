import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Asesor from "../../../../models/Asesor";

export const recargarAsesor = async (root, { numeroDocumento, valorRecarga }, context) => {
    // VALIDACION DE AUTORIZACION
    if (context.autorizacion &&
        context.rol == "ADMINISTRADOR") {
        try {
            const admin = await Asesor.find({ numeroDocumento: "admin" });
            const asesor = await Asesor.find(
                { numeroDocumento },
                (error, data) => handleResponse(error, data, "Recargar Asesor"))
                .clone();
            if (asesor.length == 0) throw new Error("El asesor no existe!");
            else {
                const { _id, saldo, tasaPreferencial, usarTasaPreferencial } = asesor[0];
                const { tasaVenta } = admin[0];

                valorRecarga = Number((valorRecarga / (usarTasaPreferencial ? tasaPreferencial : tasaVenta)).toFixed(2));
                
                const asesorEditado = await Asesor.findByIdAndUpdate(
                    _id,
                    { saldo: saldo + valorRecarga },
                    { new: true },
                    (error, data) => handleResponse(error, data, "Recargar Asesor"))
                    .clone();
                if (asesorEditado) return asesorEditado;
                else throw new Error("No se pudo recargar el asesor");
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};