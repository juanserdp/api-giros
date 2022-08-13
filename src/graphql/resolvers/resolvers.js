import { obtenerUsuarios } from "./query/obtenerUsuarios";
import { obtenerUsuarioPorId } from "./query/obtenerUsuarioPorId";
import { crearUsuario } from "./mutation/crearUsuario";
import { editarUsuario } from "./mutation/editarUsuario";
import { eliminarUsuario } from "./mutation/eliminarUsuario";
import { crearGiro } from "./mutation/crearGiro";
import { obtenerGiros } from "./query/obtenerGiros";
import { obtenerGiroPorId } from "./query/obtenerGiroPorIdUsuario";
import { editarGiro } from "./mutation/editarGiro";
import { eliminarGiro } from "./mutation/eliminarGiro";

export const resolvers = {
    Query:{},
    Mutation:{}
};

resolvers.Query.obtenerUsuarios = obtenerUsuarios;
resolvers.Query.obtenerUsuarioPorId = obtenerUsuarioPorId;

resolvers.Query.obtenerGiros = obtenerGiros;
resolvers.Query.obtenerGiroPorId = obtenerGiroPorId;

resolvers.Mutation.crearUsuario = crearUsuario;
resolvers.Mutation.editarUsuario = editarUsuario;
resolvers.Mutation.eliminarUsuario = eliminarUsuario;

resolvers.Mutation.crearGiro = crearGiro;
resolvers.Mutation.editarGiro = editarGiro;
resolvers.Mutation.eliminarGiro = eliminarGiro;