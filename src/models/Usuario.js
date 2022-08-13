import { Schema, model } from "mongoose";

const UsuarioSchema = new Schema({
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
        requried: true
    },
    giros: [{
            type: Schema.Types.ObjectId,
            ref: "Giro",
            required: true
        }],
}, { collection: "Usuarios" });

export default model("Usuario", UsuarioSchema);
