import EnviarGiro from "../../../../helpers/EnviarGiro";
import Giro from "../../../../models/Giro";
import Usuario from "../../../../models/Usuario";

export const crearGiro = async (_root, { usuario, nombres, apellidos, tipoDocumento, numeroDocumento, banco, tipoCuenta, numeroCuenta, valorGiro, tasaCompra }, context) => {
    if (context.autorizacion &&
        context.rol === "USUARIO") {
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

        try {
            let user = await Usuario.findById(usuario, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar crear un giro al usuario con id: ${usuario}, el error es: ${error}`)
                else if (rta) console.log(rta);
            }).clone();
            const giroUser = new EnviarGiro(user.saldo, user.deuda, user.capacidadPrestamo);

            if (user) console.log("Usuario ANTES: ", giroUser.obtenerCuentas());

            // EL SALDO MAS LA CAPACIDAD DE ENDEUDARSE MENOS LAS DEUDAS ACTUALES MENOS
            // EL GIRO QUE ENVIARA DEBE SER SUPERIOR A CERO

            if (giroUser.puedeHacerElGiro(valorGiro, (error, value) => {
                if (value) return true;
                else return false;
            })) {
                let rtaGiroSave = await giro.save(null, async function (error, doc) {
                    if (error) console.error(`Hubo un error al intentar crear un usuario. error: ${error} `, " from crearUsuario.js");
                    else {
                        if (user) {
                            const { _id, giros } = user;
                            if (_id && giros) {
                                giroUser.hacerGiro(valorGiro);
                                const update = giroUser.obtenerCuentas();
                                const usuarioModificado = await Usuario.findByIdAndUpdate(usuario, update, { new: true }).clone();
                                if (usuarioModificado) console.log("Usuario DESPUES: ", update);
                            }
                        }
                        else console.error("No se pudo encontrar el usuario!, por lo tanto no se ha ingresado en la coleccion: 'Usuarios' el giro", " from crearGiro.js");
                        console.log(rtaGiroSave, " from crearGiro.js");
                        return rtaGiroSave;
                    };
                });


            }
            else throw new Error(`Saldo insuficiente!`);
        } catch (error) {
            console.error(error, " from crearGiro.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from crearGiro.js");
        throw new Error("No estas autorizado!");
    }
}