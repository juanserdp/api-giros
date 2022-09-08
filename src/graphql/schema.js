import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers/resolvers";

export const typeDefs = `
    type Query{
        """ USUARIOS """
        obtenerUsuarios: [Usuario]
        obtenerUsuarioPorId(id: ID!): Usuario
        obtenerUsuariosPorIdAsesor(id: ID!): [Usuario]

        """ ASESORES """
        obtenerAsesores: [Asesor]
        obtenerAsesorPorId(id: ID!): Asesor

        """ GIROS """
        obtenerGiros: [Giro]
        obtenerGiroPorId(id: ID!): Giro
        obtenerGirosPorIdUsuario(id: ID!): [Giro]

        """ CONFIGURACION """
        obtenerConfiguracion: Configuracion
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
            deuda: Float,
            capacidadPrestamo: Float,
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
            estado: String!,
        ): Asesor
        editarAsesor(
            id: ID!,
            nombres: String,
            apellidos: String,
            tipoDocumento: String,
            numeroDocumento: String,
            clave: String,
            saldo: Float,
            estado: String,
            tasaVenta: Float!
        ): Asesor
        eliminarAsesor(id: ID!): Asesor
        recargarAsesor(
            numeroDocumento: String!,
            valorRecarga: Float!
        ): Asesor!


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
            tasaCompra: Float!
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
            comprobantePago: String
        ): Giro
        eliminarGiro(id: ID!): Giro

        crearComprobantePago(id: ID!): Giro
        eliminarComprobantePago(id: ID!): Giro

        """ CONFIGURACION """
        definirConfiguracion(
            buzon: [String!],
            valorMinimoGiro: Float!,
            valorMinimoRecarga: Float!
        ): Configuracion
        editarConfiguracion(
            buzon: [String!],
            valorMinimoGiro: Float,
            valorMinimoRecarga: Float
        ): Configuracion
    }


    """ INTERFACES """
    interface DatosPersonales{
        id: ID,
        nombres: String,
        apellidos: String,
        tipoDocumento: String,
        numeroDocumento: String
    }

    """ TIPOS """

    type Usuario implements DatosPersonales{
        id: ID,
        asesor: Asesor,
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
    type Giro implements DatosPersonales{
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
        comprobantePago: String,
        fechaEnvio: String,
        tasaCompra: Float
    }
    type Asesor implements DatosPersonales{
        id: ID,
        nombres: String,
        apellidos: String,
        tipoDocumento: String,
        numeroDocumento: String,
        clave: String,
        saldo: Float,
        usuarios: [Usuario],
        estado: String,
        tasaVenta: Float
    }
    type Token{
        token: String,
        error: String
    }
    type Configuracion{
        id: ID,
        buzon: [String],
        valorMinimoGiro: Float,
        valorMinimoRecarga: Float
    }
`;

export default makeExecutableSchema({
    typeDefs: [typeDefs],
    resolvers: resolvers
});