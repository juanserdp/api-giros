import { generarJwt } from "../../../../helpers/generarJwt";
import Usuario from "../../../../models/Usuario";
import bycript from "bcrypt";
import Asesor from "../../../../models/Asesor";
import autenticarCredenciales from "../../../../helpers/autenticarCrendenciales";

export const login = async (_, { numeroDocumento, clave }, context) => {
    try {
        let usuario = await Usuario.where({ numeroDocumento }).findOne();
        let asesor = await Asesor.where({ numeroDocumento }).findOne();
        let resultAut;
        if (usuario) {
            console.log("Usuario: ", usuario, "from login.js");
            resultAut = autenticarCredenciales(usuario, numeroDocumento, clave, (error) => { if (error) console.error(error); });
            if (!resultAut) return { token: await generarJwt(usuario.id, usuario.estado, "USUARIO") };
        }
        if (asesor) {
            console.log("Asesor: ", asesor, "from login.js");
            resultAut = autenticarCredenciales(asesor, numeroDocumento, clave, (error) => { if (error) console.error(error); })
            // OJO QUE EL ADMIN NO CAMBIE SU NOMBRE POR ERROR
            if (numeroDocumento === "admin")
                if (bycript.compareSync(clave, asesor.clave))
                    return { token: await generarJwt(asesor.id, asesor.estado, "ADMINISTRADOR") };

            if (numeroDocumento === "operario")
                if (bycript.compareSync(clave, asesor.clave))
                    return { token: await generarJwt(asesor.id, asesor.estado, "OPERARIO") };

            if (!resultAut) return { token: await generarJwt(asesor.id, asesor.estado, "ASESOR") };
        }
        if (resultAut) return resultAut;
        else return { error: "Usuario o contraseña incorrectos" };
    } catch (error) {
        throw new Error(error);
    }
}

