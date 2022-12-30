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
    tasaVenta
`;

export const giroCamposGql = `
    id
    usuario
    nombres
    nombresRemitente
    apellidos
    apellidosRemitente
    tipoDocumento
    tipoDocumentoRemitente
    numeroDocumento
    numeroDocumentoRemitente
    banco
    tipoCuenta
    numeroCuenta
    valorGiro
    comprobantePago
    fechaEnvio
    estadoGiro
    tasaCompra
`;

export const mensajeCamposGql = `
    id
    mensaje
    imagen
    fechaCreacion
    fechaUltimaModificacion
`;