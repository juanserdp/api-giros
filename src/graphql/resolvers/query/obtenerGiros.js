import Giro from "../../../models/Giro";

export const obtenerGiros = async () => {
    if (true) {
        try {
            return await Giro.find({}, function (err, doc) {
                if (err) return { error: "Hubo un error al intentar obtener todos los giros" };
                else console.log(doc);
            }).clone();
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