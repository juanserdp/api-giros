import MongoError from "../errors/MongoError";

export function handleResponse(error, data, ruta = "") {
    if (error)
        console.error(new MongoError(`Ocurrio un error con Mongo. Ruta: ${ruta}`));
    else if (data)
        console.log("Respuesta: " + data, "\nRuta: " + ruta);
};