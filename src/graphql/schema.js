import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers/resolvers";

export const typeDefs = `
    type Query{
        """ USUARIOS """
        obtenerUsuarios: [Usuario]! 
        obtenerUsuarioPorId(id: ID!): Usuario!
        obtenerUsuariosPorIdAsesor(id: ID!): [Usuario]!

        """ ASESORES """
        obtenerAsesores: [Asesor]!
        obtenerAsesorPorId(id: ID!): Asesor!

        """ GIROS """
        obtenerGiros: [Giro]!
        obtenerGiroPorId(id: ID!): Giro!
        obtenerGirosPorIdUsuario(id: ID!): [Giro]!
        obtenerGirosPorUsuariosPorIdAsesor(id: ID!): [Giro]!

        """ CONFIGURACION """
        obtenerConfiguraciones: [Configuracion]!
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
            capacidadPrestamo: Float!,
            tasaVenta: Float!
            ): Usuario!
        editarUsuario(
            id: ID!,
            usuario: UsuarioForUpdateInput!
            ): Usuario!

        eliminarUsuario(id: ID!): Usuario!
        recargarUsuario(
            numeroDocumento: String!,
            valorRecarga: Float!
            ): Usuario!



        """ ASESORES """
        crearAsesor( 
            nombres: String!, 
            apellidos: String!,
            tipoDocumento: String!,
            numeroDocumento: String!,
            clave: String!,
            saldo: Float!
            ): Asesor! 
        editarAsesor( 
            id: ID!,
            asesor: AsesorForUpdateInput!
            ): Asesor!
        eliminarAsesor(
            id: ID!
            ): Asesor! 
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
            ): Giro!
        editarGiro(
            id: ID!,
            giro: GiroForUpdateInput!
            ): Giro!
        eliminarGiro(id: ID!): Giro!
        crearComprobantePago(id: ID!): Giro!
        editarComprobantePago(id: ID!): Giro!


        """ CONFIGURACION """
        crearConfiguracion(
            asesor: ID!,
            buzon: [String!],
            valorMinimoGiro: Float!,
            valorMinimoRecarga: Float!
        ): Configuracion!
        editarConfiguracion(
            asesor: ID!,
            configuracion: ConfiguracionForUpdateInput!
        ): Configuracion!
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
        estado: String,
        tasaVenta: Float
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
        tasaCompra: Float,
        estadoGiro: String
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
        tasaVenta: Float,
        valorMinimoGiro: Float
    }
    type Token{
        token: String,
        error: String
    }
    type Configuracion{
        valorMinimoGiro: Float
    }

    """ INPUTS """
    input AsesorForUpdateInput{
        nombres: String,
        apellidos: String,
        tipoDocumento: String,
        numeroDocumento: String,
        clave: String,
        saldo: Float,
        estado: String,
        tasaVenta: Float,
        valorMinimoGiro: Float
    }
    input UsuarioForUpdateInput{
        nombres: String,
        apellidos: String,
        tipoDocumento: String,
        numeroDocumento: String,
        clave: String,
        saldo: Float,
        deuda: Float,
        capacidadPrestamo: Float,
        estado: String,
        tasaVenta: Float
    }
    input GiroForUpdateInput{
        nombres: String,
        apellidos: String,
        tipoDocumento: String,
        numeroDocumento: String,
        banco: String,
        tipoCuenta: String,
        numeroCuenta: String,
        valorGiro: Float,
        comprobantePago: String,
        tasaCompra: Float,
        estadoGiro: String
    }
    input ConfiguracionForUpdateInput{
        valorMinimoGiro: Float,
    }
`;

export default makeExecutableSchema({
    typeDefs: [typeDefs],
    resolvers: resolvers
});