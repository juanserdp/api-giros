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
        obtenerTasaAdmin: Asesor!
        obtenerTasaAsesorPorId: Asesor!
        obtenerAsesorPorId(id: ID!): Asesor!

        """ GIROS """
        obtenerGiros: [Giro]!
        obtenerGiroPorId(id: ID!): Giro!
        obtenerGirosPorIdUsuario(id: ID!): [Giro]!
        obtenerGirosPorUsuariosPorIdAsesor(id: ID!): [Giro]!

        """ MENSAJES """
        obtenerMensajes: [Mensaje]!

        """ MOVIMIENTOS """
        obtenerMovimientos: [Movimiento]!
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
            capacidadPrestamo: Float!
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
            nombresRemitente: String!,
            apellidos: String!,
            apellidosRemitente: String!,
            tipoDocumento: String!,
            tipoDocumentoRemitente: String!,
            numeroDocumento: String!,
            numeroDocumentoRemitente: String!,
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

        """ MENSAJES """
        crearMensaje(
            mensaje: String,
            imagen: String
        ): Mensaje!
        editarMensaje(
            id: ID!,
            mensaje: MensajeForUpdateInput!
        ): Mensaje!
        eliminarMensaje(id: ID!): Mensaje!
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
        tasaPreferencial: Float,
        usarTasaPreferencial: Boolean,
        tasaVenta: Float,
        movimientos: [Movimiento]
    }
    type Giro implements DatosPersonales{
        id: ID,
        usuario: ID,
        nombres: String,
        nombresRemitente: String,
        apellidos: String,
        apellidosRemitente: String,
        tipoDocumento: String,
        tipoDocumentoRemitente: String,
        numeroDocumento: String,
        numeroDocumentoRemitente: String,
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
        valorMinimoGiro: Float,
        tasaPreferencial: Float,
        usarTasaPreferencial: Boolean,
        movimientos: [Movimiento],
    }
    type Token{
        token: String,
        error: String
    }

    type Mensaje{
        id: ID,
        mensaje: String,
        imagen: String,
        fechaCreacion: String,
        fechaUltimaModificacion: String
    }

    type Movimiento{
        id: ID,
        valor: Float,
        saldo: Float,
        deuda: Float,
        fechaEnvio: String,
        sentido: String,
        concepto: String
    }
    
    type Tasa{
        tasa: Float
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
        valorMinimoGiro: Float,
        tasaPreferencial: Float,
        usarTasaPreferencial: Boolean
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
        tasaPreferencial: Float,
        usarTasaPreferencial: Boolean,
        tasaVenta: Float
    }
    input GiroForUpdateInput{
        nombres: String,
        nombresRemitente: String,
        apellidos: String,
        apellidosRemitente: String,
        tipoDocumento: String,
        tipoDocumentoRemitente: String,
        numeroDocumento: String,
        numeroDocumentoRemitente: String,
        banco: String,
        tipoCuenta: String,
        numeroCuenta: String,
        valorGiro: Float,
        comprobantePago: String,
        #tasaCompra: Float,
        estadoGiro: String
    }
    input MensajeForUpdateInput{
        mensaje: String,
        imagen: String
    }

`;

export default makeExecutableSchema({
    typeDefs: [typeDefs],
    resolvers: resolvers,
});
