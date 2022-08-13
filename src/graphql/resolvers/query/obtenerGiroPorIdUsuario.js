import Giro from "../../../models/Giro";

export const obtenerGiroPorId = async (_,{id}) => {
    if (true) {
        try {
            return await Giro.findById(id, function (err, doc) {
                if (err) return { error: `Hubo un error al intentar obtener el giro con id: ${id}`};
                else return doc;
            }).clone();
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