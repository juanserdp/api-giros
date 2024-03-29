import { Schema, model } from "mongoose";

const UsuarioSchema = new Schema({
    asesor: {
        type: Schema.Types.ObjectId,
        ref: 'Asesor',
        required: true
    },
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    tipoDocumento: {
        type: String,
        required: true
    },
    numeroDocumento: {
        type: String,
        required: true
    },
    clave: {
        type: String,
        required: true
    },
    saldo: {
        type: Number,
        required: true // CREAR UN USUARIO - ES OBLIGATORIO - EL SALDO
    },
    deuda: {
        type: Number,
        required: false,
        default: 0 // CREAR UN USUARIO - POR DEFECTO - DEUDA = 0
    },
    capacidadPrestamo: {
        type: Number,
        required: true // CREAR UN USUARIO - ES OBLIGATORIO - CAPACIDAD DE PRESTAMO
    },
    giros: [{
        type: Schema.Types.ObjectId,
        ref: "Giro",
        required: true
    }],
    estado: {
        type: String,
        required: false,
        enum: ['ACTIVO', 'INACTIVO'],
        default: 'ACTIVO' // CREAR UN USUARIO - POR DEFECTO - ESTADO = "ACTIVO"
    },
    tasaPreferencial: {
        type: Number,
        required: false,
        default: 1 //  CREAR UN USUARIO - ES OBLIGATORIO - TASA DE VENTA
    },
    usarTasaPreferencial: {
        type: Boolean,
        required: false,
        default: false
    },
    tasaVenta: {
        type: Number,
        required: false, // CREAR ASESOR - POR DEFECTO - TASA VENTA = 0
        default: 1
    },
    movimientos: [{
        type: Schema.Types.ObjectId,
        ref: "Movimiento",
        required: true
    }]
}, { collection: "Usuarios" });

export default model("Usuario", UsuarioSchema);
