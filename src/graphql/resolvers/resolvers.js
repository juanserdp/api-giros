import { login } from "./mutation/login/login";
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

import { crearAsesor } from "./mutation/asesor/crearAsesor";
import { editarAsesor } from "./mutation/asesor/editarAsesor";
import { eliminarAsesor } from "./mutation/asesor/eliminarAsesor";
import { obtenerAsesores } from "./query/asesor/obtenerAsesores";
import {obtenerTasaAdmin} from "./query/asesor/obtenerTasaAdmin";
import {obtenerTasaAsesorPorId} from "./query/asesor/obtenerTasaAsesorPorId";
import { obtenerAsesorPorId } from "./query/asesor/obtenerAsesorPorId";

import { recargarAsesor } from "./mutation/asesor/recargarAsesor";
import { recargarUsuario } from "./mutation/usuario/recargarUsuario";

import { obtenerGirosPorUsuariosPorIdAsesor } from "./query/giro/obtenerGirosPorUsuariosPorIdAsesor";

import { obtenerMensajes } from "./query/mensaje/obtenerMensajes";
import { crearMensaje } from "./mutation/mensaje/crearMensaje";
import { editarMensaje } from "./mutation/mensaje/editarMensaje";
import { eliminarMensaje } from "./mutation/mensaje/eliminarMensaje";

export const resolvers = {
    Query: {
        obtenerUsuarios,
        obtenerUsuarioPorId,
        obtenerUsuariosPorIdAsesor,
        obtenerGiros,
        obtenerGiroPorId,
        obtenerGirosPorIdUsuario,
        obtenerGirosPorUsuariosPorIdAsesor,
        obtenerAsesores,
        obtenerTasaAdmin,
        obtenerTasaAsesorPorId,
        obtenerAsesorPorId,
        obtenerMensajes
    },
    Mutation: {
        login,
        crearUsuario,
        editarUsuario,
        eliminarUsuario,
        crearGiro,
        editarGiro,
        eliminarGiro,
        crearAsesor,
        editarAsesor,
        eliminarAsesor,
        recargarAsesor,
        recargarUsuario,
        crearMensaje,
        editarMensaje,
        eliminarMensaje
    }
};