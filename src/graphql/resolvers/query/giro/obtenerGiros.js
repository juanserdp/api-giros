import Giro from "../../../../models/Giro";

export const obtenerGiros = async (_root, _args, context) => {
    if (context.autorizacion && context.uid === "admin") {
        try {
            let giros;
            if (giros = await Giro.find({}, function (error, rta) {
                if (error) console.error(`Ocurrio un error al intentar obtener todos los giros, el error es: ${error}`);
                else if(rta) console.log(rta);
            }).clone()) return giros;
            throw new Error(`Ocurrio un error al intentar obtener todos los giros`);
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