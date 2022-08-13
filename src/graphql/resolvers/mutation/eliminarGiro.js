import Giro from "../../../models/Giro";

export const eliminarGiro = async (_, { id }) => {
    if (true) {
        try {
            return await Giro.findByIdAndDelete(id, function (err, doc) {
                if (err) return { error: `Hubo un error al intentar eliminar el giro con id: ${id}` };
                else console.log(doc);
            }).clone();
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!");
        throw new Error("No estas autorizado!");
    }
}