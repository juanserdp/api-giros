import Asesor from "../../../../models/Asesor";
import bycript from "bcrypt";
const saltRounds = 12;
const salt = bycript.genSaltSync(saltRounds);
export const crearAsesor = async (_root, { nombres, apellidos, tipoDocumento, numeroDocumento, clave, saldo, estado }, context) => {
    if (context.autorizacion &&
        (context.rol === "ADMINISTRADOR")) {
        /*/ VALIDAR QUE ESTE USUARIO NO SE HAYA REGISTRADO ANTES/*/
        try {
            let user = await Asesor.find({ numeroDocumento }, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar buscar entre todos los asesores un asesor con ese documento, el error es: ${error}`, " from crearAsesor.js");
                else if (rta[0]) console.log("Este asesor ya existe: ", rta, " from crearAsesor.js");
            }).clone();
            if (user.length == 0) {
                const asesor = new Asesor({
                    nombres,
                    apellidos,
                    tipoDocumento,
                    numeroDocumento,
                    clave: bycript.hashSync(clave, salt),
                    saldo,
                    estado,
                    tasaVenta: 0
                });
                let rtaAsesorSave = await asesor.save(null, function (error, doc) {
                    if (error) console.error(`Hubo un error al intentar crear un asesor. error: ${error} `, " from crearAsesor.js");
                    else if (doc) console.log(doc, " from crearAsesor.js");
                });
                if (rtaAsesorSave) return rtaAsesorSave;
            }
            else throw new Error("El asesor ya existe!");
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