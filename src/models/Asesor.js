import { Schema, model } from "mongoose";

const AsesorSchema = new Schema({
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
        requried: true,
    },
    saldo: {
        type: Number,
        requried: true,
        default: 0
    },
    usuarios: [{
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    }],
    estado: {
        type: String,
        requried: true,
        enum:['ACTIVO','INACTIVO'],
        default: 'ACTIVO'
    }
}, { collection: "Asesores" });

export default model("Asesor", AsesorSchema);
