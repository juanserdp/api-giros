import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Recargar from "../../../../helpers/Recargar";
import Asesor from "../../../../models/Asesor";
import Movimiento from "../../../../models/Movimiento";
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
                const { _id, saldo, tasaPreferencial, usarTasaPreferencial } = usuario[0];

                const transferencia = new Recargar(asesor.saldo, null, null, valorRecarga);

                if (transferencia.puedeHacerLaRecarga(valorRecarga, (error, value) => {
                    if (value) return true;
                    else return false;
                })) {
                    transferencia.hacerRecarga(valorRecarga);

                    // SE INSTANCIA LA CLASE MOVIMIENTO DEL USUARIO
                    const movimiento = new Movimiento({
                        valor: valorRecarga,
                        saldo: usuario[0].saldo + valorRecarga,
                        fechaEnvio: new Intl.DateTimeFormat('es-co').format(new Date()),
                        sentido: "HABER",
                        concepto: "Recarga del asesor"
                    });

                    // GUARDO DEL MOVIMIENTO
                    const responseMovimiento = await movimiento.save();

                    if (responseMovimiento) {
                        const usuarioEditado = await Usuario.findByIdAndUpdate(
                            _id,
                            { saldo: saldo + valorRecarga, movimientos: [...usuario[0].movimientos, responseMovimiento.id] },
                            { new: true },
                            (error, data) => handleResponse(error, data, "Recargar Usuario"))
                            .clone();
                        if (usuarioEditado) {

                            const update = transferencia.obtenerCuentas();

                            // INSTANCIAMOS UNA CLASE MOVIMIENTO PARA EL ASESOR
                            const movimientoAsesor = new Movimiento({
                                valor: valorRecarga,
                                saldo: update.saldo,
                                fechaEnvio: new Intl.DateTimeFormat('es-co').format(new Date()),
                                sentido: "DEUDA",
                                concepto: `Recarga al usuario identificado con: ${usuario[0].numeroDocumento}`
                            });

                            const responseMovimientoAsesor = await movimientoAsesor.save();

                            if (responseMovimientoAsesor) {

                                const asesorEditado = await Asesor.findByIdAndUpdate(
                                    asesor.id,
                                    { saldo: update.saldo, movimientos: [...asesor.movimientos, responseMovimientoAsesor.id]  },
                                    { new: true },
                                    (error, data) => handleResponse(error, data, "Recargar Usuario"))
                                    .clone();
                                if (asesorEditado) return usuarioEditado;
                                else throw new Error("No se pudo descontar al asesor el saldo");
                            }
                            else throw new Error("No se pudo crear el registro del movimiento del dinero");
                            
                        }
                        else throw new Error("No se pudo recargar el usuario");
                    }
                    else throw new Error("No se pudo crear el registro del movimiento del dinero");

                }
            }

        } catch (error) {
            throw new Error(error);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};