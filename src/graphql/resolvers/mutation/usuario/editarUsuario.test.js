import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { iniciarSesionComoAdmin } from "../../../../constants/login";
import { v4 as uuidv4 } from 'uuid';
chai.use(chaiGraphQL);
const supertest = require("supertest");

const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;
let tokenAdmin = "";

function revisarCamposEspecificos(error, res, done, campos) {
    if (error) return done(error);
    assert.graphQL(res.body);

    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('usuario');

    const { usuario } = res.body.data;
    expect(usuario).to.be.a("object");

    for (const prop in campos) {
        expect(usuario).to.have.property(prop);
        if (prop == 'clave') {
            expect(usuario[prop]).to.be.a("string");
            expect(usuario[prop]).to.have.lengthOf(60);
            continue;
        };
        if (prop == 'usuarios') {
            expect(usuario[prop]).to.be.a("array");
            expect(usuario[prop]).to.have.lengthOf(0);
            continue;
        };
        expect(usuario[prop]).to.equal(campos[prop]);
    };
    done();
}
const numeroDocumento = uuidv4();
let idUsuario = "6323c2169dcbd4df0f1b43e5";

const EDITAR_USUARIO = `
    mutation editarUsuario(
        $id: ID!
        $usuario: UsuarioForUpdateInput!
    ){
        usuario: editarUsuario(
            id: $id,
            usuario: $usuario
            ){
                id
                nombres
                apellidos
                tipoDocumento
                numeroDocumento
                clave
                saldo
                deuda
                capacidadPrestamo
                estado
                tasaVenta
                giros{
                    id
                }
        }
    }
`;
const camposEsperadosEditarUsuario = {
    nombres: "JUAN",
    apellidos: "RODRIGUEZ",
    tipoDocumento: "CC",
    numeroDocumento: numeroDocumento + "134",
    clave: "12345",
    saldo: 100000,
    deuda: 12,
    capacidadPrestamo: 400000,
    estado: "INACTIVO",
    tasaVenta: 0.12
};

const EDITAR_USUARIO_DATOS_PERSONALES = `
    mutation editarUsuario(
        $id: ID!
        $usuario: UsuarioForUpdateInput!
    ){
        usuario: editarUsuario(
            id: $id,
            usuario: $usuario
            ){
                nombres
                apellidos
                tipoDocumento
                numeroDocumento
        }
    }
`;
const camposEsperadosDeEditarDatosPersonales = {
    nombres: "Sebitas",
    apellidos: "Pci",
    tipoDocumento: "TI",
    numeroDocumento: numeroDocumento + "1231514786"
};
const EDITAR_USUARIO_CLAVE = `
    mutation editarUsuario(
        $id: ID!
        $usuario: UsuarioForUpdateInput!
    ){
        usuario: editarUsuario(
            id: $id,
            usuario: $usuario
            ){
                clave
        }
    }
`;
const camposEsperadosDeEditarClave = {
    clave: "1234513"
};
const EDITAR_USUARIO_SALDO = `
    mutation editarUsuario(
        $id: ID!
        $usuario: UsuarioForUpdateInput!
    ){
        usuario: editarUsuario(
            id: $id,
            usuario: $usuario
            ){
                saldo
        }
    }
`;
const camposEsperadosDeEditarSaldo = {
    saldo: 1234513
};
const EDITAR_USUARIO_DEUDA = `
    mutation editarUsuario(
        $id: ID!
        $usuario: UsuarioForUpdateInput!
    ){
        usuario: editarUsuario(
            id: $id,
            usuario: $usuario
            ){
                deuda
        }
    }
`;
const camposEsperadosDeEditarDeuda = {
    deuda: 123123342
};
const EDITAR_USUARIO_CAPACIDAD_PRESTAMO = `
    mutation editarUsuario(
        $id: ID!
        $usuario: UsuarioForUpdateInput!
    ){
        usuario: editarUsuario(
            id: $id,
            usuario: $usuario
            ){
                capacidadPrestamo
        }
    }
`;
const camposEsperadosDeEditarCapacidadPrestamo = {
    capacidadPrestamo: 1564
};

const EDITAR_USUARIO_ESTADO = `
    mutation editarUsuario(
        $id: ID!
        $usuario: UsuarioForUpdateInput!
    ){
        usuario: editarUsuario(
            id: $id,
            usuario: $usuario
            ){
                estado
        }
    }
`;
const camposEsperadosDeEditarEstado = {
    estado: "ACTIVO"
};

const EDITAR_USUARIO_TASA_VENTA = `
    mutation editarUsuario(
        $id: ID!
        $usuario: UsuarioForUpdateInput!
    ){
        usuario: editarUsuario(
            id: $id,
            usuario: $usuario
            ){
                tasaVenta
        }
    }
`;
const camposEsperadosDeEditarTasaVenta = {
    tasaVenta: 0.123
};
describe("POST: Editar Usuario", () => {
    it("Inicia sesion como administrador", (done) => {
        request
            .post("/")
            .send({
                query: iniciarSesionComoAdmin
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);
                expect(res.body.data.login.token).to.be.a("string");
                tokenAdmin = res.body.data.login.token;
                done();
            });
    }, 30000);
    const camposParaEditarUsuario = {
        id: idUsuario,
        usuario: {
            nombres: "JUAN",
            apellidos: "RODRIGUEZ",
            tipoDocumento: "CC",
            numeroDocumento: numeroDocumento + "134",
            clave: "12345",
            saldo: 100000,
            deuda: 12,
            capacidadPrestamo: 400000,
            estado: "INACTIVO",
            tasaVenta: 0.12
        }
    };
    it("Editar el usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO,
                variables: camposParaEditarUsuario
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosEditarUsuario));
    }, 30000);
    it("Obtener un error si el numero de documento se repite", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO,
                variables: camposParaEditarUsuario
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(500)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQLError(res.body);
                expect(res.body).to.have.property('errors');

                expect(res.body.errors).to.be.a("array");
                expect(res.body.errors).to.have.lengthOf(1);

                const { message } = res.body.errors[0];
                expect(message).to.be.a("string");
                expect(message).to.equal("Error: Ya existe un usuario con ese numero de documento!");
                done();
            });
    }, 30000)

    const camposParaEditarDatosPersonales = {
        id: idUsuario,
        usuario: {
            nombres: "Sebitas",
            apellidos: "Pci",
            tipoDocumento: "TI",
            numeroDocumento: numeroDocumento + "1231514786"
        }
    };
    it("Editar los datos personales del usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO_DATOS_PERSONALES,
                variables: camposParaEditarDatosPersonales
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosDeEditarDatosPersonales));
    }, 30000);
    const camposParaEditarClave = {
        id: idUsuario,
        usuario: {
            clave: "1234513"
        }
    };
    it("Editar la contraseña del usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO_CLAVE,
                variables: camposParaEditarClave
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosDeEditarClave));
    }, 30000);
    const camposParaEditarEstado = {
        id: idUsuario,
        usuario: {
            estado: "ACTIVO"
        }
    };
    it("Editar el estado del usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO_ESTADO,
                variables: camposParaEditarEstado
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosDeEditarEstado));
    }, 30000);
    const camposParaEditarSaldo = {
        id: idUsuario,
        usuario: {
            saldo: 1234513
        }
    };
    it("Editar el saldo del usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO_SALDO,
                variables: camposParaEditarSaldo
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosDeEditarSaldo));
    }, 30000);
    const camposParaEditarDeuda = {
        id: idUsuario,
        usuario: {
            deuda: 123123342
        }
    };
    it("Editar la deuda del usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO_DEUDA,
                variables: camposParaEditarDeuda
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosDeEditarDeuda));
    }, 30000);
    const camposParaEditarCapacidadPrestamo = {
        id: idUsuario,
        usuario: {
            capacidadPrestamo: 1564
        }
    };
    it("Editar la capacidad de prestamo del usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO_CAPACIDAD_PRESTAMO,
                variables: camposParaEditarCapacidadPrestamo
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosDeEditarCapacidadPrestamo));
    }, 30000);
    const camposParaEditarTasaVenta = {
        id: idUsuario,
        usuario: {
            tasaVenta: 0.123
        }
    };
    it("Editar la tasa de venta del usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO_TASA_VENTA,
                variables: camposParaEditarTasaVenta
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosDeEditarTasaVenta));
    }, 30000);
});