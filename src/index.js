import express from "express";
import cors from "cors";
import schema from "./graphql/schema";
import dotenv from 'dotenv';
import multer from "multer";
import path from "path";
import { dbConnection } from "./database/config";
import { graphqlHTTP } from "express-graphql";
import { validarJwt } from "./middleware/validarJwt";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const app = express();

app.use(cors());

// MIDDLEWARE
app.use(express.urlencoded({extended: false}));
app.use(express.json({type:'*/*'}));
app.use(validarJwt);

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
});
app.use(multer({storage}).single('image'));

// app.use(router);
app.post("/comprobante", async (req, res)=>{
    console.log("****************",req.file);
});

dbConnection();

app.use("/graphql", graphqlHTTP((req, res)=>({
    graphiql: true,
    schema: schema,
    context: {
        autorizacion: req.user.autorizacion,
        uid: req.user.uid,
        estado: req.user.estado,
        rol: req.user.rol
    }
})));

app.listen(process.env.PORT || 4000, ()=>console.log(`Servidor corriendo en el puerto: ${process.env.PORT || 4000}`));