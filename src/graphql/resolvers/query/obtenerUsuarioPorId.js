import Usuario from "../../../models/Usuario";

export const obtenerUsuarioPorId = async (_,{id}) => {
    if (true) {
        try {
            return await Usuario.findById(id, function (err, doc) {
                if (err) return { error: `Hubo un error al intentar obtener el usuario con id: ${id}`};
                else return doc;
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