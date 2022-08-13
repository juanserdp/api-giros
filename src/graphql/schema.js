import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers/resolvers";

export const typeDefs = `
    type Query{
        obtenerUsuarios: [Usuario]
        obtenerUsuarioPorId(id: ID!): Usuario
        obtenerGiros: [Giro]
        obtenerGiroPorId(id: ID!): Giro
    }

    type Mutation{
        crearUsuario(
            nombres: String!,
            apellidos: String!,
            tipoDocumento: String!,
            numeroDocumento: String!,
            clave: String!,
            saldo: Float!,
        ): Usuario
        editarUsuario(
            id: ID!
            nombres: String,
            apellidos: String,
            tipoDocumento: String,
            numeroDocumento: String,
            clave: String,
            saldo: Float,
        ): Usuario
        eliminarUsuario(id: ID!): Usuario
        crearGiro(
            usuario: ID!,
            nombres: String!,
            apellidos: String!,
            tipoDocumento: String!,
            numeroDocumento: String!,
            banco: String!,
            tipoCuenta: String!,
            numeroCuenta: String!,
            valorGiro: Float!,
            comprobantePago: String!
        ): Giro
        editarGiro(
            id: ID!,
            nombres: String,
            apellidos: String,
            tipoDocumento: String,
            numeroDocumento: String,
            banco: String,
            tipoCuenta: String,
            numeroCuenta: String,
            valorGiro: Float,
            comprobantePago: String
        ): Giro
        eliminarGiro(id: ID!): Giro
    }

    type Usuario{
        id: ID,
        nombres: String,
        apellidos: String,
        tipoDocumento: String,
        numeroDocumento: String,
        clave: String,
        saldo: Float,
        giros: [Giro]
    }
    type Giro{
        id: ID,
        usuario: ID,
        nombres: String,
        apellidos: String,
        tipoDocumento: String,
        numeroDocumento: String,
        banco: String,
        tipoCuenta: String,
        numeroCuenta: String,
        valorGiro: Float,
        comprobantePago: String
    }
`;

export default makeExecutableSchema({
    typeDefs: [typeDefs],
    resolvers: resolvers
});