import Asesor from "../../../../models/Asesor";

export const editarAsesor = async (_root, {id, nombres, apellidos, tipoDocumento, numeroDocumento, clave, saldo, estado }, context) => {
    if (context.autorizacion &&
        (context.rol === "ADMINISTRADOR")) {
        try {
            /*/ VALIDAR QUE EL TIPO DE DOCUMENTO NO SE REPITA/*/
            let user = await Asesor.find({ numeroDocumento }, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar buscar entre todos los asesores un asesor con ese documento, el error es: ${error}`, " from editarAsesor.js");
                else if (rta) console.log("Este asesor ya existe: ",rta, " from editarAsesor.js");
            }).clone();
            if (user.length == 0 || user[0].id === id) {
                let rtaAsesorUpdate;
                if (rtaAsesorUpdate = await Asesor.findByIdAndUpdate(id, {
                    nombres,
                    apellidos,
                    tipoDocumento,
                    numeroDocumento,
                    clave,
                    saldo,
                    estado
                }, function (error, doc) {
                    if (error) console.error(`Hubo un error al intentar editar el Asesor con id: ${id}. error: ${error} `, " from editarAsesor.js");
                    else if (doc) console.log("Asesor editado: ", doc, " from editarAsesor.js");
                }).clone()) return rtaAsesorUpdate;
            }
            else throw new Error(`El asesor con id:${id}  ya existe!`);
        } catch (error) {
            console.error(error, " from editarAsesor.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from editarAsesor.js");
        throw new Error("No estas autorizado!");
    }

    if (context.autorizacion &&
        context.rol === "ASESOR") {
        try {
            /*/ VALIDAR QUE EL TIPO DE DOCUMENTO NO SE REPITA/*/
            let rtaAsesorUpdate;
            if (rtaAsesorUpdate = await Asesor.findByIdAndUpdate(id, {
                nombres,
                apellidos,
                tipoDocumento,
                numeroDocumento,
                clave
            }, function (error, doc) {
                if (error) console.error(`Hubo un error al intentar editar el Asesor con id: ${id}. error: ${error} `, " from editarAsesor.js");
                else if (doc) console.log("Asesor editado: ", doc, " from editarAsesor.js");
            }).clone()) return rtaAsesorUpdate;
        } catch (error) {
            console.error(error, " from editarAsesor.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from editarAsesor.js");
        throw new Error("No estas autorizado!");
    }
}