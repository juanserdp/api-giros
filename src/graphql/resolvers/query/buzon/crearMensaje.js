import AuthorizationError from "../../../../errors/AuthorizationError";
import Configuracion from "../../../../models/Configuracion";

export const crearMensaje = async (root, {
    mensaje
}, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR") {
        try {
            const configuacion = await Configuracion.find({}, function (error, data) {
                if (error) console.error("No se pudo otener la configuracion", " from crearMensaje.js");
                else if (data[0]) console.log("Configuracion: ", data[0], " from crearMensaje.js");
            }).clone();
            if (!configuacion[0]) throw new Error("No se encontro la configuacion")
            else {
                const { _id, buzon } = configuacion[0];
                buzon.push(mensaje);
                const configuacionEditada = Configuracion.findByIdAndUpdate(_id, {
                    buzon: buzon
                }, function (error, data) {
                    if (error) console.log("Ocurrio un error al intentar modificar la configuracion!", " from crearMensaje.js");
                    else if (data) console.log("El buzon fue editado: ", data.buzon, " from crearMensaje.js")
                }, { new: true }).clone();
                if (!configuacionEditada) throw new Error("No se pudo editar la configuracion");
                else return configuacionEditada;
            }
        } catch (error) {
            console.error("Ocurrio un error: ", error, " from crearMensaje.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from crearMensaje.js");
        throw new AuthorizationError("No estas autorizado!");
    };
};