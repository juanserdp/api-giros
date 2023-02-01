import { Schema, model } from "mongoose";

const MovimientoSchema = new Schema(
    {
        valor: { 
            type: Number,
            required: true,
        },
        saldo: {
            type: Number,
            required: true,
        },
        deuda: {
            type: Number,
            required: false,
        },
        fechaEnvio: {
            type: String,
            required: true,
        },
        sentido: {
            type: String,
            required: true,
            enum: ["HABER", "DEUDA"]
        },
        concepto: {
            type: String,
            required: true,
        }
    },
    { collection: "Movimientos" }
);

export default model("Movimiento", MovimientoSchema);
