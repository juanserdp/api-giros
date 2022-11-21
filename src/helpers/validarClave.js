export const seguridad = {
    longitud: 8,
    cantidadLetras: 1,
    cantidadMayusculas: 1,
    cantidadNumeros: 1
};

export function validarClave(clave = "", response) {
    const error = {
        longitud: `La clave debe contener al menos ${seguridad.longitud} caracteres`,
        cantidadLetras: `La clave debe contener al menos ${seguridad.cantidadLetras} letra`,
        cantidadMayusculas: `La clave debe contener al menos ${seguridad.cantidadMayusculas} mayuscula`,
        cantidadNumeros: `La clave debe contener al menos ${seguridad.cantidadNumeros} numero`
    };
    const propiedades = {
        longitud: 0,
        cantidadLetras: 0,
        cantidadMayusculas: 0,
        cantidadNumeros: 0
    };
    for (const c of clave) {
        propiedades.longitud += 1;
        if (/[a-z]/.test(c)) {
            propiedades.cantidadLetras += 1;
            continue;
        }
        else if (/[A-Z]/.test(c)) {
            propiedades.cantidadMayusculas += 1;
            continue;
        }
        else if (/[0-9]/.test(c)) {
            propiedades.cantidadNumeros += 1;
            continue;
        }
    };
    const errores = [];
    for (const prop in propiedades) {
        if (propiedades[prop] < seguridad[prop]) {
            errores.push(error[prop]);
        }
    };
    if (errores.length === 0) return response(null, clave);
    else return response(errores, null);
};