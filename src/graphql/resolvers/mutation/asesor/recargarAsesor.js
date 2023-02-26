import AuthorizationError from "../../../../errors/AuthorizationError";
import { handleResponse } from "../../../../helpers/handleResponse";
import Recargar from "../../../../helpers/Recargar";
import Asesor from "../../../../models/Asesor";
import Movimiento from "../../../../models/Movimiento";

export const recargarAsesor = async (root, { numeroDocumento, valorRecarga }, context) => {
    // VALIDACION DE AUTORIZACION
    if (context.autorizacion &&
        context.rol == "ADMINISTRADOR") {
        try {
            // OBTENER DATOS DEL ADMINISTRADOR
            const admin = await Asesor.find({ numeroDocumento: "admin" });

            // OBTENER DATOS DEL ASESOR
            const asesor = await Asesor.find({ numeroDocumento });

            // SI ENCUENTRA AL ASESOR SIGUE
            if (asesor.length == 0) throw new Error("El asesor no existe!");
            else {
                // INSTANCIO LA CLASE RECARGAR CON LOS VALORES DEL ADMINISTRADOR
                const transferencia = new Recargar(admin[0].saldo, null, null, valorRecarga);

                // SI EL ADMINISTRADOR PUEDE HACER LA TRANSFERENCIA ENTONCES CONTINUA
                if (transferencia.puedeHacerLaRecarga(valorRecarga, (error, value) => {
                    if (value) return true;
                    else return false;
                })) {
                    // HACER LA RECARGA
                    transferencia.hacerRecarga(valorRecarga);

                    // SE INSTANCIA LA CLASE MOVIMIENTO DEL ASESOR
                    const movimiento = new Movimiento({
                        valor: valorRecarga,
                        saldo: asesor[0].saldo + valorRecarga,
                        fechaEnvio: new Intl.DateTimeFormat('es-co').format(new Date()),
                        sentido: "HABER",
                        concepto: "Recarga del administrador"
                    });

                    // GUARDO DEL MOVIMIENTO
                    const responseMovimiento = await movimiento.save();

                    // SI SE GUARDA DEL MOVIMIENTO ENTONCES CONTINUA
                    if (responseMovimiento) {
                        const { _id } = responseMovimiento;
                        const asesorEditado = await Asesor.findByIdAndUpdate(
                            asesor[0].id,
                            { saldo: asesor[0].saldo + valorRecarga, movimientos: [...asesor[0].movimientos, _id] },
                            { new: true },
                            (error, data) => handleResponse(error, data, "Recargar Asesor"))
                            .clone();

                        // SI SE EDITA EL ASESOR ENTONCES CONTINUA
                        if (asesorEditado) {

                            // OBTENEMOS LAS CUENTA DEL ADMINISTRADOR
                            const update = transferencia.obtenerCuentas();

                            // INSTANCIAMOS UNA CLASE MOVIMIENTO PARA EL ADMINISTRADOR
                            const movimientoAdmin = new Movimiento({
                                valor: valorRecarga,
                                saldo: update.saldo,
                                fechaEnvio: new Intl.DateTimeFormat('es-co').format(new Date()),
                                sentido: "DEUDA",
                                concepto: `Recarga al asesor identificado con: ${asesor[0].numeroDocumento}`
                            });

                            // SE GUARDA EL MOVIMIENTO DEL ADMINISTRADOR
                            const responseMovimientoAdmin = await movimientoAdmin.save();

                            // SI EL MOVIMIENTO SE GUARDA ENTONCES CONTINUA
                            if (responseMovimiento) {
                                const { _id } = responseMovimientoAdmin;

                                // ACTUALIZAMOS LA INFORMACION DEL ADMINISTRADOR
                                const adminEditado = await Asesor.findByIdAndUpdate(
                                    admin[0].id,
                                    { saldo: update.saldo, movimientos: [...admin[0].movimientos, _id] },
                                    { new: true },
                                    (error, data) => handleResponse(error, data, "Recargar Admin"))
                                    .clone();
                                if (adminEditado) return asesorEditado;
                                else throw new Error("No se pudo descontar al administrador el saldo");
                            }
                            else throw new Error("No se pudo crear el registro del movimiento del dinero");
                        }
                        else throw new Error("No se pudo recargar el asesor");
                    }
                    else throw new Error("No se pudo crear el registro del movimiento del dinero");
                }
                else throw new Error("Fondos insuficientes! Porfavor recargue su saldo!");
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
};