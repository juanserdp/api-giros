import Usuario from "../../../../models/Usuario";

export const obtenerUsuarioPorId = async (_root, {id}, context) => {
    if (context.autorizacion && context.uid === "admin") {
        try {
            let usuario;
            if(usuario = await Usuario.findById(id, function (error, rta) {
                    if (error) return console.error(`Ocurrio un error interno de mongo al intentar obtener el usuario con id: ${id}, el error es: ${error}`)
                    else if(rta) console.log(rta);
                }).clone().populate("giros")) return usuario;
            else throw new Error(`Ocurrio un error al intentar obtener el usuario con id: ${id}, porfavor revise que el id proporcionado exista.`)
        }
        catch (e) {
            console.error(e.message);
            throw new Error(e);
        }
    }
    else {
        console.error("No estas autorizado!");
        throw new Error("No estas autorizado!");
    }
}