import Usuario from "../../../models/Usuario";

export const crearUsuario = async (_, { nombres, apellidos, tipoDocumento, numeroDocumento, clave, saldo }) => {
    if (true) {
        try {
            const usuario = new Usuario({
                nombres,
                apellidos,
                tipoDocumento,
                numeroDocumento,
                clave,
                saldo
            });
            return await usuario.save(null, function (err, doc) {
                if (err) return { error: "Hubo un error al intentar crear un usuario" };
                else console.log(doc);
            });
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
