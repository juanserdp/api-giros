import { Schema, model } from "mongoose";

const GiroSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
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
    banco: {
        type: String,
        required: true
    },
    tipoCuenta: {
        type: String,
        required: true
    },
    numeroCuenta: {
        type: String,
        required: true
    },
    valorGiro: { //OJO PORQUE QUE SENTIDO TIENE ENVIAR GIROS DE CERO PESOS
        type: Number,
        required: true
    },
    comprobantePago: { // NOT REQUIRED
        type: String,
        required: false
    },
    fechaEnvio: {
        type: String,
        required: true
    },
    tasaCompra: {
        type: Number,
        required: true
    },
    estadoGiro: {
        type: String,
        required: false,
        enum: ['PENDIENTE', 'EN PROCESO', 'COMPLETADO'],
        default: 'PENDIENTE' // ENVIAR UN GIRO - POR DEFECTO - ESTADO = "PENDIENTE"
    },
}, { collection: "Giros" });

export default model("Giro", GiroSchema);

