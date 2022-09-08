import AuthorizationError from "../../../errors/AuthorizationError";
import Configuracion from "../../../models/Configuracion";

export const editarConfiguracion = async (root, {
    buzon,
    valorMinimoGiro,
    valorMinimoRecarga
}, context) => {
    if (context.autorizacion &&
        context.rol === "ADMINISTRADOR") {
        try {
            const configuacion = await Configuracion.find({}, function (error, data) {
                if (error) console.error("No se pudo otener la configuracion", " from editarConfiguracion.js");
                else if (data[0]) console.log("Configuracion: ", data[0], " from editarConfiguracion.js");
            }).clone();
            if (!configuacion[0]) throw new Error("No se encontro la configuacion")
            else {
                const { _id } = configuacion[0];
                const configuacionEditada = await Configuracion.findByIdAndUpdate(_id, {
                    buzon,
                    valorMinimoGiro,
                    valorMinimoRecarga
                },
                    // function (error, data) {
                    //     if (error) console.error("Ocurrio un error al intentar modificar la configuracion!", " from editarConfiguracion.js");
                    //     else if (data) console.log("La configuracion fue editada: ", data, " from editarConfiguracion.js");
                    // },
                    { new: true }).clone();
                if (!configuacionEditada) throw new Error("No se pudo editar la configuracion");
                else return configuacionEditada;
            }
        } catch (error) {
            console.error("Ocurrio un error: ", error, " from editarConfiguracion.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from editarConfiguracion.js");
        throw new AuthorizationError("No estas autorizado!");
    };
};

