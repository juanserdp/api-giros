import { admin, asesor, claveAdmin, claveAsesor, claveUsuario, usuario } from "./cuentas";

export const iniciarSesionComoAdmin = `
    mutation{
        login(numeroDocumento: "${admin}", clave: "${claveAdmin}"){
            token
        }
    }
`;
export const iniciarSesionComoAsesor = `
    mutation{
        login(numeroDocumento: "${asesor}", clave: "${claveAsesor}"){
            token
        }
    }
`;
export const iniciarSesionComoUsuario = `
    mutation{
        login(numeroDocumento: "${usuario}", clave: "${claveUsuario}"){
            error
            token
        }
    }
`;