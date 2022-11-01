import { model, Schema } from "mongoose";

const MensajeSchema = new Schema({
    mensaje: {
        type: String,
        required: false
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