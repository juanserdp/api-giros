import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Asesor from "../../../../models/Asesor";
import Usuario from "../../../../models/Usuario";

export const recargarUsuario = async (root, { numeroDocumento, valorRecarga }, context) => {
    if (context.autorizacion &&
        (context.rol == "ADMINISTRADOR" ||
            context.rol == "ASESOR")) {
        try {
            const asesor = await Asesor.findById(context.uid);
            const usuario = await Usuario.find(
                { numeroDocumento },
                (error, data) => handleResponse(error, data, "Recargar Usuario"))
                .clone()
                .populate("asesor");
            if (usuario.length == 0) throw new Error("El usuario no existe!");
            else {
                const { _id, asesor, saldo, tasaPreferencial, usarTasaPreferencial } = usuario[0];
                const { tasaVenta } = asesor;

                valorRecarga = Number((valorRecarga / (usarTasaPreferencial ? tasaPreferencial : tasaVenta)).toFixed(2));

                const usuarioEditado = await Usuario.findByIdAndUpdate(
                    _id,
                    { saldo: saldo + valorRecarga },
                    { new: true },
                    (error, data) => handleResponse(error, data, "Recargar Usuario"))
                    .clone();
                if (usuarioEditado) {
                    const { _id, saldo } = asesor;
                    const asesorEditado = await Asesor.findByIdAndUpdate(
                        _id,
                        { saldo: saldo - valorRecarga },
                        { new: true },
                        (error, data) => handleResponse(error, data, "Recargar Usuario"))
                        .clone();
                    if (asesorEditado) return usuarioEditado;
                    else throw new Error("No se pudo descontar al asesor el saldo");
                }
                else throw new Error("No se pudo recargar el usuario");
            }

        } catch (error) {
            throw new Error(error);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};