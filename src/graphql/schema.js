import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers/resolvers";

export const typeDefs = `
    type Query{
        obtenerUsuarios: [Usuario]
        obtenerUsuarioPorId(id: ID!): Usuario
        obtenerGiros: [Giro]
        obtenerGiroPorId(id: ID!): Giro
        obtenerGirosPorIdUsuario(id: ID!): [Giro]
    }

    type Mutation{
        """ INICIO SESION """
        login(numeroDocumento: String!, clave: String!): Token!
        
        """ USUARIOS """
        crearUsuario(
            asesor: ID!,
            nombres: String!,
            apellidos: String!,
            tipoDocumento: String!,
            numeroDocumento: String!,
            clave: String!,
            saldo: Float!,
            deuda: Float!,
            capacidadPrestamo: Float!,
            estado: String!
        ): Usuario
        editarUsuario(
            id: ID!
            nombres: String,
            apellidos: String,
            tipoDocumento: String,
            numeroDocumento: String,
            clave: String,
            saldo: Float,
            estado: String
        ): Usuario
        eliminarUsuario(id: ID!): Usuario

        """ ASESORES """
        crearAsesor(
            nombres: String!,
            apellidos: String!,
            tipoDocumento: String!,
            numeroDocumento: String!,
            clave: String!,
            saldo: Float!,
            estado: String!
        ): Asesor

        """ GIROS """
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
            valorGiro: Float
        ): Giro
        eliminarGiro(id: ID!): Giro


        crearComprobantePago(id: ID!): Giro
        eliminarComprobantePago(id: ID!): Giro
    }

    type Usuario{
        id: ID,
        asesor: ID,
        nombres: String,
        apellidos: String,
        tipoDocumento: String,
        numeroDocumento: String,
        clave: String,
        saldo: Float,
        deuda: Float,
        capacidadPrestamo: Float,
        giros: [Giro],
        estado: String
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
    type Asesor{
        id: ID,
        nombres: String,
        apellidos: String,
        tipoDocumento: String,
        numeroDocumento: String,
        clave: String,
        saldo: Float,
        usuarios: [Usuario],
        estado: String
    }
    type Token{
        token: String,
        error: String
    }
`;

export default makeExecutableSchema({
    typeDefs: [typeDefs],
    resolvers: resolvers
});