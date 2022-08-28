import Giro from "../../../../models/Giro";

export const editarGiro = async (_root, {id, nombres, apellidos, tipoDocumento, numeroDocumento, banco, tipoCuenta, numeroCuenta, comprobantePago }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            return await Giro.findByIdAndUpdate(id, {
                nombres,
                apellidos,
                tipoDocumento,
                numeroDocumento,
                banco,
                tipoCuenta,
                numeroCuenta,
                // valorGiro, EL DINERO NO SE EDITA, GIRO ENVIADO GIRO PAGADO
                comprobantePago
            }, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar editar el giro con id: ${id}, el error es: ${error}`, " from crearGiro.js");
                else if (rta) console.log(rta, " from crearGiro.js");
            }).clone();
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from crearGiro.js");
        throw new Error("No estas autorizado!");
    }
}