import { obtenerUsuarios } from "./query/usuario/obtenerUsuarios";
import { obtenerUsuarioPorId } from "./query/usuario/obtenerUsuarioPorId";
import { crearUsuario } from "./mutation/usuario/crearUsuario";
import { editarUsuario } from "./mutation/usuario/editarUsuario";
import { eliminarUsuario } from "./mutation/usuario/eliminarUsuario";
import { crearGiro } from "./mutation/giro/crearGiro";
import { obtenerGiros } from "./query/giro/obtenerGiros";
import { obtenerGiroPorId } from "./query/giro/obtenerGiroPorId";
import { editarGiro } from "./mutation/giro/editarGiro";
import { eliminarGiro } from "./mutation/giro/eliminarGiro";
import { login } from "./mutation/login";
import { crearComprobantePago } from "./mutation/crearComprobantePago";
import { eliminarComprobantePago } from "./mutation/eliminarComprobantePago";
import { obtenerGirosPorIdUsuario } from "./query/giro/obtenerGirosPorIdUsuario";
import { crearAsesor } from "./mutation/asesor/creaAsesor";

export const resolvers = {
    Query:{},
    Mutation:{}
};

resolvers.Query.obtenerUsuarios = obtenerUsuarios;
resolvers.Query.obtenerUsuarioPorId = obtenerUsuarioPorId;

resolvers.Query.obtenerGiros = obtenerGiros;
resolvers.Query.obtenerGiroPorId = obtenerGiroPorId;
resolvers.Query.obtenerGirosPorIdUsuario = obtenerGirosPorIdUsuario;


resolvers.Mutation.login = login;
resolvers.Mutation.crearUsuario = crearUsuario;
resolvers.Mutation.editarUsuario = editarUsuario;
resolvers.Mutation.eliminarUsuario = eliminarUsuario;

resolvers.Mutation.crearGiro = crearGiro;
resolvers.Mutation.editarGiro = editarGiro;
resolvers.Mutation.eliminarGiro = eliminarGiro;

resolvers.Mutation.crearComprobantePago = crearComprobantePago;
resolvers.Mutation.eliminarComprobantePago = eliminarComprobantePago;

resolvers.Mutation.crearAsesor = crearAsesor;