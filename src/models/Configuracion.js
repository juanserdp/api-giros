import { model, Schema } from "mongoose";

const ConfiguracionSchema = new Schema({
    asesor:{
        type: Schema.Types.ObjectId,
        ref: 'Asesor',
        required: true
    },
    buzon: {
        type: [String],
        required: false
    },
    valorMinimoGiro: {
        type: Number,
        required: true
    },
    valorMinimoRecarga:{
        type: Number,
        required: true
    }
}, { collection: "Configuraciones" });

export default model("Configuracion",ConfiguracionSchema);