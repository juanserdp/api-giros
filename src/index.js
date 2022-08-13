import express from "express";
import cors from "cors";
import schema from "./graphql/schema";
import dotenv from 'dotenv';
import { dbConnection } from "./database/config";
import { graphqlHTTP } from "express-graphql";

// dotenv.config();
const app = express();
app.use(express.json({type:'*/*'}));

dbConnection();

app.use(cors());

app.use("/graphql", graphqlHTTP((req, res)=>({
    graphiql: true,
    schema: schema,
})));

app.listen(process.env.PORT || 4000, ()=>console.log(`Servidor corriendo en el puerto: ${process.env.PORT || 4000}`));