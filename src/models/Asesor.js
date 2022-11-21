import { Schema, model } from "mongoose";

const AsesorSchema = new Schema({
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
        required: true  // CREAR ASESOR - ES OBLIGATORIO - UN SALDO
    },
    usuarios: [{
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    }],
    estado: {
        type: String,
        required: false,
        enum: ['ACTIVO', 'INACTIVO'],
        default: 'ACTIVO'
    },
    tasaVenta: {
        type: Number,
        required: false, // CREAR ASESOR - POR DEFECTO - TASA VENTA = 0
        default: 1
    },
    valorMinimoGiro: {
        type: Number,
        required: false,
        default: 1
    },
    tasaPreferencial: {
        type: Number,
        required: false,
        default: 1 
    },
    usarTasaPreferencial: {
        type: Boolean,
        required: false,
        default: false
    }
}, { collection: "Asesores" });

export default model("Asesor", AsesorSchema);
