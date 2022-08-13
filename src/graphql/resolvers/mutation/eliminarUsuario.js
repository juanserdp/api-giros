import Usuario from "../../../models/Usuario";

export const eliminarUsuario = async (_, { id }) => {
    if (true) {
        try {
            return await Usuario.findByIdAndDelete(id, function (err, doc) {
                if (err) return { error: `Hubo un error al intentar eliminar el usuario con id: ${id}` };
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