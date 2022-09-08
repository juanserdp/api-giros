import AuthorizationError from "../../../../errors/AuthorizationError";
import Configuracion from "../../../../models/Configuracion";

export const editarMensaje= async (root, {
    indice,
    mensaje
}, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR") {
        try {
            const configuacion = await Configuracion.find({}, function (error, data) {
                if (error) console.error("No se pudo otener la configuracion", " from editarMensaje.js");
                else if (data[0]) console.log("Configuracion: ", data[0], " from editarMensaje.js");
            }).clone();
            if (!configuacion[0]) throw new Error("No se encontro la configuacion")
            else {
                const { _id, buzon } = configuacion[0];
                buzon[indice] = mensaje;
                const configuacionEditada = await Configuracion.findByIdAndUpdate(_id, {
                    buzon: buzon
                }, function (error, data) {
                    if (error) console.log("Ocurrio un error al intentar modificar la configuracion!", " from editarMensaje.js");
                    else if (data) console.log("El buzon fue editado: ", data.buzon, " from editarMensaje.js")
                }, { new: true }).clone();
                if (!configuacionEditada) throw new Error("No se pudo editar la configuracion");
                else return configuacionEditada;
            }
        } catch (error) {
            console.error("Ocurrio un error: ", error, " from editarMensaje.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from editarMensaje.js");
        throw new AuthorizationError("No estas autorizado!");
    };
};