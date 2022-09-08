import AuthorizationError from "../../../../errors/AuthorizationError";
import EnviarGiro from "../../../../helpers/EnviarGiro";
import Giro from "../../../../models/Giro";
import Usuario from "../../../../models/Usuario";

export const crearGiro = async (_root, { usuario, nombres, apellidos, tipoDocumento, numeroDocumento, banco, tipoCuenta, numeroCuenta, valorGiro, tasaCompra }, context) => {
    if (context.autorizacion &&
        context.rol === "USUARIO") {
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
                fechaEnvio: (new Date()).toLocaleDateString(),
                tasaCompra
            });
            // BUSCAMOS EL USUARIO PARA OBTENER LAS CUENTAS DE LA PERSONAS QUE ENVIAR EL GIRO
            const datosPersonalesUsuario = await Usuario.findById(usuario, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar crear un giro al usuario con id: ${usuario}, el error es: ${error}`)
                else if (rta) console.log(rta);
            }).clone();

            if (!datosPersonalesUsuario) throw new Error("No se pudo obtener los datos del usuario!");
            else {
                // INSTANCIAMOS UN OBJETO ENVIARGIRO E INICIALIZAMOS CON LAS CUENTAS ANTES DE HACER EL GIRO
                const enviarGiro = new EnviarGiro(datosPersonalesUsuario.saldo, datosPersonalesUsuario.deuda, datosPersonalesUsuario.capacidadPrestamo);
                console.log("Usuario ANTES: ", enviarGiro.obtenerCuentas());

                // VALIDAMOS QUE PUEDA HACER EL GIRO
                if (enviarGiro.puedeHacerElGiro(valorGiro, (error, value) => {
                    if (value) return true;
                    else return false;
                })) {
                    // EXTRAEMOS LOS GIROS
                    const { giros } = datosPersonalesUsuario;
                    if (!Array.isArray(giros)) throw new Error(`No se pudo obtener el conjunto de giros del usuario`);
                    else {
                        // HACEMOS EL GIRO EN LA INSTANCIA
                        enviarGiro.hacerGiro(valorGiro);

                        // GUARDAMOS EL GIRO EN LA BD
                        const giroEnviado = await giro.save();

                        if (!giroEnviado) throw new Error("Ocurrio un error al intentar enviar el giro!");
                        else {
                            // OBTENEMOS EL ID DEL GIRO PARA AGREGARLO AL USUARIO
                            const { _id } = giroEnviado;
                            
                            // OBTENEMOS LAS CUENTAS DESPUES DEL GIRO
                            const update = enviarGiro.obtenerCuentas();
                            console.log(update);
                            // AGREGAMOS LA MODIFICACION DE LAS CUENTAS Y AGREGAMOS EL ID DEL GIRO AL ARRAY 
                            const usuarioModificado = await Usuario.findByIdAndUpdate(usuario, {
                                ...update, giros: [...giros, _id]
                            }, { new: true }).clone();
                            if (usuarioModificado) console.log("Usuario DESPUES: ", update);
                        }
                    }
                }
                else throw new Error(`Saldo insuficiente!`);
            }
        } catch (error) {
            console.error(error, " from crearGiro.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from crearGiro.js");
        throw new AuthorizationError("No estas autorizado!");
    }
}