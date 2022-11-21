import { model, Schema } from "mongoose";

const MensajeSchema = new Schema({
    mensaje: {
        type: String,
        required: false,
        default: null
    },
    imagen: {
        type: String,
        required: false,
        default: null
    },
    fechaCreacion: {
        type: String,
        required: true
    },
    fechaUltimaModificacion: {
        type: String,
        required: true
    }
}, { collection: "Mensajes" });

export default model("Mensaje", MensajeSchema);