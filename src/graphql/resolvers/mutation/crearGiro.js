import Giro from "../../../models/Giro";
import Usuario from "../../../models/Usuario";

export const crearGiro = async (_, { usuario, nombres, apellidos, tipoDocumento, numeroDocumento, banco, tipoCuenta, numeroCuenta, valorGiro, comprobantePago }) => {
    if (true) {
        const giro = new Giro({
            usuario,
            nombres,
            apellidos,
            tipoDocumento,
            numeroDocumento,
            banco,
            tipoCuenta,
            numeroCuenta,
            valorGiro,
            comprobantePago
        });
        try {
            const giroJSON = await giro.save();
            const { _id } = giroJSON;
            if (_id) {
                try {
                    const { giros } = await Usuario.findById(usuario,
                        function (err, doc) {
                            if (err) {
                                Giro.findByIdAndDelete(_id);
                                return { error: `Hubo un error al intentar obtener el usuario con id: ${id}` };
                            }
                            else return doc;
                        }).clone();
                    await Usuario.findByIdAndUpdate(usuario, {
                        giros: [...giros, _id]
                    }, { new: true }, function (err) {
                        if (err) {
                            Giro.findByIdAndDelete(_id);
                            return { error: `Hubo un error al intentar guardar el giro con id: ${_id} ` };
                        }
                    }).clone();
                    console.log(giroJSON);
                    return giroJSON;
                } catch (error) {
                    Giro.findByIdAndDelete(_id);
                    console.error(error);
                    throw new Error(error);
                }
            }
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