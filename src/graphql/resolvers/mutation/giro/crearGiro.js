import AuthorizationError from "../../../../errors/AuthorizationError";
import EnviarGiro from "../../../../helpers/EnviarGiro";
import { handleResponse } from "../../../../helpers/handleResponse";
import Giro from "../../../../models/Giro";
import Usuario from "../../../../models/Usuario";

export const crearGiro = async (_root,
    { usuario,
        nombres,
        apellidos,
        tipoDocumento,
        numeroDocumento,
        banco,
        tipoCuenta,
        numeroCuenta,
        valorGiro,
        // tasaCompra
    }, context) => {
    if (context.autorizacion &&
        (context.rol === "USUARIO" ||
            context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            const giro = new Giro({
                usuario,
                nombres,
                apellidos,
                tipoDocumento,
                numeroDocumento,
                banco,
                tipoCuenta,
                numeroCuenta,
                valorGiro,
                fechaEnvio: new Intl.DateTimeFormat('es-co').format(new Date()),
                estadoGiro: "PENDIENTE"
            });
            const usuarioInfo = await Usuario.findById(
                usuario,
                (error, data) => handleResponse(error, data, "Crear Giro"))
                .clone();
            if (usuarioInfo) {
                const { giros } = usuarioInfo;
                const transferencia = new EnviarGiro(usuarioInfo.saldo, usuarioInfo.deuda, usuarioInfo.capacidadPrestamo);
                if (transferencia.puedeHacerElGiro(valorGiro, (error, value) => {
                    if (value) return true;
                    else return false;
                })) {
                    transferencia.hacerGiro(valorGiro);
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
                        if (usuarioModificado) return response;
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