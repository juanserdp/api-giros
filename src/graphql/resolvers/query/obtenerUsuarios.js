import Usuario from "../../../models/Usuario";

export const obtenerUsuarios = async () => {
    if (true) {
        try {
            return await Usuario.find({}, function (err, doc) {
                if (err) return { error: "Hubo un error al intentar obtener los usuarios" };
                else console.log(doc);
            }).clone().populate("giros");
        }
        catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }
    else {
        console.error("No estas autorizado!");
        throw new Error("No estas autorizado!");
    }
}