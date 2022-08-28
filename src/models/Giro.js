import { Schema, model } from "mongoose";

const GiroSchema = new Schema({
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        requried: true
    },
    nombres:{
        type: String,
        requried: true
    },
    apellidos:{
        type: String,
        requried: true
    },
    tipoDocumento:{
        type: String,
        requried: true
    },
    numeroDocumento:{
        type: String,
        requried: true
    },
    banco:{
        type: String,
        requried: true
    },
    tipoCuenta:{
        type: String,
        requried: true
    },
    numeroCuenta:{
        type: String,
        requried: true
    },
    valorGiro:{ //OJO PORQUE QUE SENTIDO TIENE ENVIAR GIROS DE CERO PESOS
        type: Number,
        requried: true
    },
    comprobantePago:{ // NOT REQUIRED
        type: String,
        requried: false
    },
    fechaEnvio: {
        type: String,
        requried: true
    },
    tasaCompra:{
        type: Number,
        required: true
    }
}, { collection: "Giros" });

export default model("Giro", GiroSchema);

