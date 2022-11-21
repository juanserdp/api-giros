export const asesorCamposGql = `
    id
    nombres
    apellidos
    tipoDocumento
    numeroDocumento
    clave
    saldo
    usuarios{
        id
    }
    estado
    tasaVenta
    valorMinimoGiro
    tasaPreferencial
    usarTasaPreferencial
`;

export const usuarioCamposGql = `
    id
    nombres
    apellidos
    tipoDocumento
    numeroDocumento
    clave
    saldo
    deuda
    capacidadPrestamo
    giros{
        id
    }
    estado
    tasaPreferencial
    usarTasaPreferencial
`;

export const giroCamposGql = `
    id
    usuario
    nombres
    apellidos
    tipoDocumento
    numeroDocumento
    banco
    tipoCuenta
    numeroCuenta
    valorGiro
    comprobantePago
    fechaEnvio
    estadoGiro
`;

export const mensajeCamposGql = `
    id
    mensaje
    imagen
    fechaCreacion
    fechaUltimaModificacion
`;