import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        if (await mongoose.connect("mongodb+srv://admin:um1w55jy6dGkOunH@clustergiros.zuttdis.mongodb.net/?retryWrites=true&w=majority"))
            console.log("Se ha conectado a la base de datos");
    } catch (e) {
        console.error(e);
    }
}