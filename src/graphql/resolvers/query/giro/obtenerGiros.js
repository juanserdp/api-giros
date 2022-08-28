import Giro from "../../../../models/Giro";

export const obtenerGiros = async (_root, _args, context) => {
    if (context.autorizacion &&
        (context.rol === "ASESOR" ||
            context.rol === "ADMINISTRADOR")) {
        try {
            let giros = await Giro.find({}, function (error, rta) {
                if (error) console.error(`Ocurrio un error al intentar obtener todos los giros, el error es: ${error}`, "from obtenerGiros.js");
                else if (rta) console.log(rta, "from obtenerGiros.js");
            }).clone();
            if (giros) return giros;
            throw new Error(`Ocurrio un error al intentar obtener todos los giros`);
        }
        catch (e) {
            console.error(e, "from obtenerGiros.js");
            throw new Error(e);
        }
    }
    else {
        console.error("No estas autorizado!", "from obtenerGiros.js");
        throw new Error("No estas autorizado!");
    }
}