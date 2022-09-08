import Usuario from "../../../../models/Usuario";
import bycript from "bcrypt";
import Asesor from "../../../../models/Asesor";
import AuthorizationError from "../../../../errors/AuthorizationError";

const saltRounds = 12;
const salt = bycript.genSaltSync(saltRounds);

export const crearUsuario = async (_root, { asesor, nombres, apellidos, tipoDocumento, numeroDocumento, clave, saldo, deuda, capacidadPrestamo, estado }, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            /*/ VALIDAR QUE ESTE USUARIO NO SE HAYA REGISTRADO ANTES/*/
            const thisUserAlreadyExists = await Usuario.find({ numeroDocumento }, function (error, user) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar buscar entre todos los usuarios un usuario con ese documento, el error es: ${error}`, " from crearUsuario.js");
                else if (user[0]) {
                    console.log("Este usuario ya existe: ", user, " from crearUsuario.js");

                }
            }).clone();
            console.log("1. ", thisUserAlreadyExists[0]);
            // SI EL USUARIO EXISTE GENERA UN ERROR
            if (thisUserAlreadyExists[0]) throw new Error("El usuario ya existe!");
            else {
                // DE LO CONTRARIO PROSIGUE CREANDO EL USUARIO
                const usuario = new Usuario({
                    asesor,
                    nombres,
                    apellidos,
                    tipoDocumento,
                    numeroDocumento,
                    clave: bycript.hashSync(clave, salt),
                    saldo,
                    deuda,
                    capacidadPrestamo,
                    estado
                });
                // GUARDAMOS EL USUARIO EN LA BASE DE DATOS
                const newUser = await usuario.save();

                // SI EL USUARIO NO QUEDA GUARDADO ENTONCES SE INFORMARA DEL ERROR
                if (!newUser) throw new Error("Ocurrio un error al intentar crear el usuario!");
                else {
                    // GUARDO EL ID DEL USUARIO CREADO
                    const { _id } = newUser;

                    // OBTENDO LOS USUARIOS DEL ASESOR
                    const { usuarios } = await Asesor.findById(asesor).populate("usuarios");

                    // SI NO ES UN ARRAY ENTONCES MANDA UN ERROR 
                    if (!Array.isArray(usuarios)) throw new Error("Ocurrio un error al intentar obtener el conjunto de usuarios del asesor!");
                    else {
                        // SI EXISTEN LOS USUARIOS ENTONCES
                        // UNA VEZ CREADO EL USUARIO DEBO ACTUALIZAR EL ASESOR Y AGREGARLE EL ID DEL USUARIO NUEVO
                        const asesorEditado = await Asesor.findByIdAndUpdate(asesor, {
                            usuarios: [...usuarios, _id]
                        }, function (error, asesor) {
                            if (error) console.error(`Hubo un error al intentar editar el Asesor con id: ${id}. error: ${error} `, " from editarAsesor.js");
                            else if (asesor) console.log("Asesor editado: ", asesor, " from editarAsesor.js");
                        }).clone();
                        console.log("3. ", asesorEditado);
                    }
                }
            }
        } catch (error) {
            console.error(error, " from crearUsuario.js");
            throw new Error(error);
        }
    }
    else {
        console.error("No estas autorizado!", " from crearUsuario.js");
        throw new AuthorizationError("No estas autorizado!");
    }
}
