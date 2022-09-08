import { model, Schema } from "mongoose";

const ConfiguracionSchema = new Schema({
    buzon: {
        type: [String]
    },
    valorMinimoGiro: {
        type: Number
    },
    valorMinimoRecarga:{
        type: Number
    }
});

export default model("Configuracion",ConfiguracionSchema)