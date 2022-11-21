import bycript from "bcrypt";
export default function autenticarCredenciales(usuario, numeroDocumento, clave, callback) {
    if (usuario.numeroDocumento != numeroDocumento) {
        callback("El numero de documento no coincide");
        return { error: "Usuario o contraseña incorrectos" };
    }
    else if (!bycript.compareSync(clave, usuario.clave)) {
        callback("El numero de documento coincide pero la clave es incorrecta: ", clave);
        return { error: "Usuario o contraseña incorrectos" };
    }
    else if (usuario.estado !== "ACTIVO") {
        callback("Las credenciales de acceso son correctas pero la cuenta esta inactiva");
        return { error: "Su usuario esta inactivo" };
    }
    else return false;
}
