import { generarJwt } from "../../../../helpers/generarJwt";
import Usuario from "../../../../models/Usuario";
import bycript from "bcrypt";
import Asesor from "../../../../models/Asesor";
import autenticarCredenciales from "../../../../helpers/autenticarCrendenciales";

export const login = async (_, { numeroDocumento, clave }, context) => {
    try {
        let usuario = await Usuario.find({ numeroDocumento });
        let asesor = await Asesor.find({ numeroDocumento });
        let resultAut;
        if (usuario[0]) {
            console.log("Usuario: ", usuario[0], "from login.js");
            resultAut = autenticarCredenciales(usuario, numeroDocumento, clave, (error) => { if (error) console.error(error); });
            if (!resultAut) return { token: await generarJwt(usuario[0].id, usuario[0].estado, "USUARIO") };
        }
        if (asesor[0]) {
            console.log("Asesor: ", asesor[0], "from login.js");
            resultAut = autenticarCredenciales(asesor, numeroDocumento, clave, (error) => { if (error) console.error(error); })
            // OJO QUE EL ADMIN NO CAMBIE SU NOMBRE POR ERROR
            if (numeroDocumento === "admin")
                if (bycript.compareSync(clave, asesor[0].clave))
                    return { token: await generarJwt("admin", asesor[0].estado, "ADMINISTRADOR") };

            if (numeroDocumento === "operario")
                if (bycript.compareSync(clave, asesor[0].clave))
                    return { token: await generarJwt("operario", asesor[0].estado, "OPERARIO") };

            if (!resultAut) return { token: await generarJwt(asesor[0].id, asesor[0].estado, "ASESOR") };
        }
        if (resultAut) return resultAut;
        else return { error: "Usuario o contraseña incorrectos" };
    } catch (error) {
        throw new Error(error);
    }
}

