import Giros from "../../../../models/Giro";
export const obtenerGirosPorIdUsuario = async (_root, {id}, context) => {
    if (context.autorizacion &&
        (context.rol === "USUARIO" ||
            context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            let giros;
            if(giros = await Giros.find({usuario: id}, function (error, rta) {
                if (error) console.error(`Ocurrio un error interno de mongo al intentar obtener los giros del usuario con id: ${id}, el error es: ${error}`, "from obtenerGirosPorIdUsuario.js");
                else if(rta) console.log(rta.giros, "from obtenerGirosPorIdUsuario.js");
            }).clone()) return giros;
            throw new Error(`Ocurrio un error al intentar obtener los giros del usuario con id: ${id}, porfavor revise que el id proporcionado exista.`);
        }
        catch (e) {
            console.error(e, "from obtenerGirosPorIdUsuario.js");
            throw new Error(e);
        }
    }
    else {
        console.error("No estas autorizado!", "from obtenerGirosPorIdUsuario.js");
        throw new Error("No estas autorizado!");
    }
}