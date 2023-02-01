import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.LINK_MONGO_DATABASE_LOCAL)
        console.log("Se ha conectado a la base de datos");
    } catch (e) {
        console.error(e);
    }
}