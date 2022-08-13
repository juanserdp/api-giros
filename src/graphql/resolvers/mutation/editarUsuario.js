import Usuario from "../../../models/Usuario";

export const editarUsuario = async (_, { id, nombres, apellidos, tipoDocumento, numeroDocumento, clave, saldo }) => {
    if (true) {
        try {
            return await Usuario.findByIdAndUpdate(id, {
                nombres,
                apellidos,
                tipoDocumento,
                numeroDocumento,
                clave,
                saldo
            }, function (err, doc) {
                if (err) return { error: `Hubo un error al intentar editar el usuario con id: ${id}` };
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