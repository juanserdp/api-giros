import { login } from "./mutation/login";
import { crearGiro } from "./mutation/giro/crearGiro";
import { editarGiro } from "./mutation/giro/editarGiro";
import { eliminarGiro } from "./mutation/giro/eliminarGiro";
import { obtenerGiros } from "./query/giro/obtenerGiros";
import { obtenerGiroPorId } from "./query/giro/obtenerGiroPorId";
import { obtenerGirosPorIdUsuario } from "./query/giro/obtenerGirosPorIdUsuario";
import { crearUsuario } from "./mutation/usuario/crearUsuario";
import { editarUsuario } from "./mutation/usuario/editarUsuario";
import { eliminarUsuario } from "./mutation/usuario/eliminarUsuario";
import { obtenerUsuarios } from "./query/usuario/obtenerUsuarios";
import { obtenerUsuarioPorId } from "./query/usuario/obtenerUsuarioPorId";
import { obtenerUsuariosPorIdAsesor } from "./query/usuario/obtenerUsuariosPorIdAsesor";

import { crearAsesor } from "./mutation/asesor/creaAsesor";
import { editarAsesor } from "./mutation/asesor/editarAsesor";
import { eliminarAsesor } from "./mutation/asesor/eliminarAsesor";
import { obtenerAsesores } from "./query/asesor/obtenerAsesores";
import { obtenerAsesorPorId } from "./query/asesor/obtenerAsesorPorId";

import { crearComprobantePago } from "./mutation/crearComprobantePago";
import { eliminarComprobantePago } from "./mutation/eliminarComprobantePago";

export const resolvers = {
    Query:{},
    Mutation:{}
};

resolvers.Query.obtenerUsuarios = obtenerUsuarios;
resolvers.Query.obtenerUsuarioPorId = obtenerUsuarioPorId;
resolvers.Query.obtenerUsuariosPorIdAsesor = obtenerUsuariosPorIdAsesor;

resolvers.Query.obtenerGiros = obtenerGiros;
resolvers.Query.obtenerGiroPorId = obtenerGiroPorId;
resolvers.Query.obtenerGirosPorIdUsuario = obtenerGirosPorIdUsuario;

resolvers.Query.obtenerAsesores = obtenerAsesores;
resolvers.Query.obtenerAsesorPorId = obtenerAsesorPorId;

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
resolvers.Mutation.editarAsesor = editarAsesor;
resolvers.Mutation.eliminarAsesor = eliminarAsesor;