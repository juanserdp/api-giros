import express from "express";
import cors from "cors";
import schema from "./graphql/schema";
import dotenv from "dotenv";
import { dbConnection } from "./database/config";
import { graphqlHTTP } from "express-graphql";
import { validarJwt } from "./middleware/validarJwt";

dotenv.config();
const app = express();

app.use(cors());

// MIDDLEWARE
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json({ type: "*/*" }));
app.use(validarJwt);

dbConnection();

app.use(
  "/graphql",
  graphqlHTTP((req, res) => ({
    graphiql: true,
    schema: schema,
    context: {
      autorizacion: req.user.autorizacion,
      uid: req.user.uid,
      estado: req.user.estado,
      rol: req.user.rol,
    },
  }))
);

app.listen(process.env.PORT || 4000, () =>
  console.log(`Servidor corriendo en el puerto: ${process.env.PORT || 4000}`)
);
