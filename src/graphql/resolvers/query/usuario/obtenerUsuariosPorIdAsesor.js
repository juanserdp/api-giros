import Usuario from "../../../../models/Usuario";

export const obtenerUsuarios = async (_root, {id}, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {//context.autorizacion && context.uid === "admin"
        try {
            let usuarios;
            if(usuarios = await Usuario.find({}, function (error, rta) {
                if (error) return console.error(`Ocurrio un error interno de mongo al intentar obtener todos los usuarios, el error es: ${error}`);
                else if(rta) console.log(rta);
            }).clone().populate("giros")) return usuarios;
            throw new Error(`Ocurrio un error al intentar obtener todos los usuarios`);
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