import Usuario from "../../../../models/Usuario";
import bycript from "bcrypt";
import { handleResponse } from "../../../../helpers/handleResponse";
import DuplicationError from "../../../../errors/DuplicationError";

const saltRounds = 12;
const salt = bycript.genSaltSync(saltRounds);

export const editarUsuario = async (_root, { id, usuario }, context) => {
    if (context.autorizacion &&
        (context.rol === "USUARIO" ||
            context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            const { numeroDocumento, clave } = usuario;
            if (clave) usuario.clave = bycript.hashSync(clave, salt);
            if (numeroDocumento) {
                const usuario = await Usuario.find(
                    { numeroDocumento },
                    (error, data) => handleResponse(error, data, "Editar Usuario"))
                    .clone();
                if (usuario.length > 0) throw new DuplicationError("Ya existe un usuario con ese numero de documento!");
            };
            const usuarioEditado = await Usuario.findByIdAndUpdate(
                id,
                usuario,
                { new: true },
                (error, data) => handleResponse(error, data, "Editar Usuario"))
                .clone();
            if (usuarioEditado) return usuarioEditado;
            else throw new Error("No se pudo editar el asesor");
        } catch (error) {
            throw new Error(error);
        };
    }
    else throw new Error("No estas autorizado!");
};