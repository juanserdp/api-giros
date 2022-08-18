import { Schema, model } from "mongoose";

const UsuarioSchema = new Schema({
    asesor:{
        type: Schema.Types.ObjectId,
        ref: 'Asesor',
        requried: true
    },
    nombres: {
        type: String,
        requried: true
    },
    apellidos: {
        type: String,
        requried: true
    },
    tipoDocumento: {
        type: String,
        requried: true
    },
    numeroDocumento: {
        type: String,
        requried: true
    },
    clave: {
        type: String,
        requried: true
    },
    saldo: {
        type: Number,
        requried: true,
        default: 0
    },
    deuda: {
        type: Number,
        requried: true,
        default: 0
    },
    capacidadPrestamo: {
        type: Number,
        requried: true,
        default: 0
    },
    giros: [{
            type: Schema.Types.ObjectId,
            ref: "Giro",
            required: true
        }],
    estado: {
        type: String,
        requried: true,
        enum:['ACTIVO','INACTIVO'],
        default: 'ACTIVO'
    }
}, { collection: "Usuarios" });

export default model("Usuario", UsuarioSchema);