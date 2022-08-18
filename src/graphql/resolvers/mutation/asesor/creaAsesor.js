import Asesor from "../../../../models/Asesor";
import bycript from "bcrypt";
const saltRounds = 12;
export const salt = bycript.genSaltSync(saltRounds);
export const crearAsesor = async (_root, { nombres, apellidos, tipoDocumento, numeroDocumento, clave, saldo, estado }, context) => {
    if (context.autorizacion &&
        (context.rol === "ADMINISTRADOR")) {
        /*/ VALIDAR QUE ESTE USUARIO NO SE HAYA REGISTRADO ANTES/*/
        try {
            const asesor = new Asesor({
                nombres,
                apellidos,
                tipoDocumento,
                numeroDocumento,
                clave: bycript.hashSync(clave, salt),
                saldo,
                estado
            });
            let rtaAsesorSave;
            if (rtaAsesorSave = await asesor.save(null, function (error, doc) {
                if (error) console.error(`Hubo un error al intentar crear un asesor. error: ${error} `, " from crearAsesor.js");
                else if (doc) console.log(doc, " from crearAsesor.js");
            })) return rtaAsesorSave;
        } catch (error) {
            console.error(error, " from crearAsesor.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from crearAsesor.js");
        throw new Error("No estas autorizado!");
    }
}