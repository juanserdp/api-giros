import Giro from "../../../../models/Giro";

export const obtenerGiroPorId = async (_root,{id}, context) => {
    if (context.autorizacion && context.uid === "admin") {
        try {
            let giro;
            if(giro = await Giro.findById(id, function (error, rta) {
                if (error) console.error(`Ocurrio un error interno de mongo al intentar obtener el giro con id: ${id}, el error es: ${error}`);
                else if(rta) console.log(rta);
            }).clone()) return giro;
            throw new Error(`Ocurrio un error al intentar obtener el giro con id: ${id}, porfavor revise que el id proporcionado exista.`);
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