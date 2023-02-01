import AuthorizationError from "../../../../errors/AuthorizationError";
import EnviarGiro from "../../../../helpers/EnviarGiro";
import { handleResponse } from "../../../../helpers/handleResponse";
import ObtenerGananciasGiro from "../../../../helpers/ObtenerGananciasGiro";
import Asesor from "../../../../models/Asesor";
import Giro from "../../../../models/Giro";
import Movimiento from "../../../../models/Movimiento";
import Usuario from "../../../../models/Usuario";

export const crearGiro = async (_root,
    { usuario,
        nombres,
        nombresRemitente,
        apellidos,
        apellidosRemitente,
        tipoDocumento,
        tipoDocumentoRemitente,
        numeroDocumento,
        numeroDocumentoRemitente,
        banco,
        tipoCuenta,
        numeroCuenta,
        valorGiro,
        tasaCompra
    }, context) => {
    if (context.autorizacion &&
        (context.rol === "USUARIO" ||
            context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            const valor = Number((valorGiro / tasaCompra).toFixed(2));
            const giro = new Giro({
                usuario,
                nombres,
                nombresRemitente,
                apellidos,
                apellidosRemitente,
                tipoDocumento,
                tipoDocumentoRemitente,
                numeroDocumento,
                numeroDocumentoRemitente,
                banco,
                tipoCuenta,
                numeroCuenta,
                valorGiro: valor,
                fechaEnvio: new Intl.DateTimeFormat('es-co').format(new Date()),
                tasaCompra,
                estadoGiro: "PENDIENTE"
            });

            const usuarioInfo = await Usuario.findById(
                usuario,
                (error, data) => handleResponse(error, data, "Crear Giro"))
                .clone();

            if (usuarioInfo) {
                const { giros } = usuarioInfo;
                const transferencia = new EnviarGiro(usuarioInfo.saldo, usuarioInfo.deuda, usuarioInfo.capacidadPrestamo);
                if (transferencia.puedeHacerElGiro(valor, (error, value) => {
                    if (value) return true;
                    else return false;
                })) {
                    transferencia.hacerGiro(valor);
                    const response = await giro.save();
                    if (response) {
                        const { _id } = response;
                        const update = transferencia.obtenerCuentas();
                        const usuarioModificado = await Usuario.findByIdAndUpdate(
                            usuario,
                            { ...update, giros: [...giros, _id] },
                            { new: true },
                            (error, data) => handleResponse(error, data, "Crear Giro"))
                            .clone();

                        if (usuarioModificado) {
                            const asesorInfo = await Asesor.findById(
                                usuarioInfo.asesor,
                                (error, data) => handleResponse(error, data, "Crear Giro"))
                                .clone();
                            if (asesorInfo) {
                                let adminInfo = await Asesor.find(
                                    { numeroDocumento: "admin" },
                                    (error, data) => handleResponse(error, data, "Crear Giro"))
                                    .clone();
                                adminInfo = adminInfo[0];
                                if (adminInfo) {
                                    const gananciaDelGiro = new ObtenerGananciasGiro(usuarioInfo, asesorInfo, adminInfo, valorGiro);
                                    const ganancias = gananciaDelGiro.obtenerCuentas();
                             
                                    const movimientoUsuario = new Movimiento({
                                        valor: ganancias.usuario,
                                        saldo: usuarioInfo.saldo + ganancias.usuario,
                                        fechaEnvio: new Intl.DateTimeFormat('es-co').format(new Date()),
                                        sentido: "HABER",
                                        concepto: `Comisión del giro hecho por el usuario`
                                    });

                                    const responseMovimientoUsuario = await movimientoUsuario.save();
                              
                                    const UsuarioModificado = await Usuario.findByIdAndUpdate(
                                        usuarioInfo.id,
                                        {
                                            saldo: usuarioInfo.saldo + ganancias.usuario,
                                            movimientos: [...usuarioInfo.movimientos, responseMovimientoUsuario.id]
                                        },
                                        { new: true },
                                        (error, data) => handleResponse(error, data, "Crear Giro"))
                                        .clone();

                                    if (UsuarioModificado) {

                                        const movimientoAsesor = new Movimiento({
                                            valor: ganancias.asesor,
                                            saldo: asesorInfo.saldo + ganancias.asesor,
                                            fechaEnvio: new Intl.DateTimeFormat('es-co').format(new Date()),
                                            sentido: "HABER",
                                            concepto: `Comisión del giro hecho por el usuario identificado con el numero: ${usuarioInfo.numeroDocumento}`
                                        });

                                        const responseMovimientoAsesor = await movimientoAsesor.save();

                                        const AsesorModificado = await Asesor.findByIdAndUpdate(
                                            asesorInfo.id,
                                            {
                                                saldo: asesorInfo.saldo + ganancias.asesor,
                                                movimientos: [...asesorInfo.movimientos, responseMovimientoAsesor.id]
                                            },
                                            { new: true },
                                            (error, data) => handleResponse(error, data, "Crear Giro"))
                                            .clone();

                                        if (AsesorModificado) {

                                            const movimientoAdmin = new Movimiento({
                                                valor: ganancias.admin,
                                                saldo: adminInfo.saldo + ganancias.admin,
                                                fechaEnvio: new Intl.DateTimeFormat('es-co').format(new Date()),
                                                sentido: "HABER",
                                                concepto: `Comisión del giro hecho por el usuario identificado con el numero: ${usuarioInfo.numeroDocumento}`
                                            });

                                            const responseMovimientoAdmin = await movimientoAdmin.save();

                                            const AdminModificado = await Asesor.findByIdAndUpdate(
                                                adminInfo.id,
                                                {
                                                    saldo: adminInfo.saldo + ganancias.admin,
                                                    movimientos: [...adminInfo.movimientos, responseMovimientoAdmin.id]
                                                },
                                                { new: true },
                                                (error, data) => handleResponse(error, data, "Crear Giro"))
                                                .clone();
                                            if (AdminModificado) return response;
                                            else throw new Error("No se pudo añadir la ganancia al admin!");
                                        }
                                        else throw new Error("No se pudo añadir la ganancia al asesor!");
                                    }
                                    else throw new Error("No se pudo añadir la ganancia al usuario!");
                                }
                                else throw new Error("No se pudo recuperar el administrador!");
                            }
                            else throw new Error("No se pudo recuperar el asesor!");
                        }
                        else throw new Error("No se pudo modificar el usuario para agregar el giro!");
                    }
                    else throw new Error("No se pudo enviar el giro!");
                }
                else throw new Error("Saldo insuficiente!");
            }
            else throw new Error("No se pudo recuperar el usuario!");
        } catch (error) {
            throw new Error(error);
        }
    }
    else throw new AuthorizationError("No estas autorizado!");
}