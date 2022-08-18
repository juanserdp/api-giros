import { VALOR_MINIMO_GIRO } from "../../../../constants/transacciones";
import Giro from "../../../../models/Giro";
import Usuario from "../../../../models/Usuario";

export const crearGiro = async (_root, { usuario, nombres, apellidos, tipoDocumento, numeroDocumento, banco, tipoCuenta, numeroCuenta, valorGiro }, context) => {
    if (context.autorizacion &&
        context.rol === "USUARIO") {
        // OJO VALIDAR QUE EL VALOR DEL GIRO SEA MAYOR A TANTO 1000 PESOS
        const giro = new Giro({
            usuario,
            nombres,
            apellidos,
            tipoDocumento,
            numeroDocumento,
            banco,
            tipoCuenta,
            numeroCuenta,
            valorGiro
        });
        try {
        /*/ VALIDAR QUE ESTE GIRO NO SEA MENOR QUE EL MINIMO/*/
            if (valorGiro <= VALOR_MINIMO_GIRO)
                throw new Error(`El valor minimo para hacer un giro es de ${VALOR_MINIMO_GIRO}`);
            let rtaGiroSave;
            let rtaUsuarioSave;
            if (rtaGiroSave = await giro.save()) {
                const { _id } = rtaGiroSave;
                if (_id) {
                    try {
                        if (rtaUsuarioSave = await Usuario.findById(usuario)) {
                            const { giros } = rtaUsuarioSave;
                            if(giros){
                                await Usuario.findByIdAndUpdate(usuario, {
                                    giros: [...giros, _id]
                                }, { new: true }).clone();
                            }
                        }
                        else console.error("No se pudo encontrar el usuario!, por lo tanto no se ha ingresado en la coleccion: 'Usuarios' el giro", " from crearGiro.js");
                        console.log(rtaGiroSave, " from crearGiro.js");
                        return rtaGiroSave;
                    } catch (error) {
                        console.error(error, " from crearGiro.js");
                        throw new Error(error);
                    }
                }
            }
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