import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { iniciarSesionComoAdmin, iniciarSesionComoAsesor } from "../../../../constants/login";
import { v4 as uuidv4 } from 'uuid';
import { usuarioCamposGql } from "../../../../constants/camposGraphql";
var atob = require('atob');
chai.use(chaiGraphQL);
const supertest = require("supertest");
const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;
let tokenAdmin = "";
let tokenAsesor = "";
let idAsesor = "";
let idUsuario = "";

const numeroDocumento = uuidv4();

const OBTENER_USUARIOS = `
query {
    usuarios: obtenerUsuarios{
        ${usuarioCamposGql}
    }
}
`;
const CREAR_USUARIO = `
mutation crearUsuario(
    $asesor: ID!
    $nombres: String!
    $apellidos: String!
    $tipoDocumento: String!
    $numeroDocumento: String!
    $clave: String!
    $saldo: Float!
    $capacidadPrestamo: Float!
){
    usuario: crearUsuario(
        asesor: $asesor,
        nombres: $nombres,
        apellidos: $apellidos,
        tipoDocumento: $tipoDocumento,
        numeroDocumento: $numeroDocumento,
        clave: $clave,
        saldo: $saldo,
        capacidadPrestamo: $capacidadPrestamo
        ){
            ${usuarioCamposGql}
    }
}`;
const ELIMINAR_USUARIO = `
mutation EliminarUsuario($id:ID!){
    usuario: eliminarUsuario(id:$id){
        ${usuarioCamposGql}
    }
}
`;

const datosCrearUsuario = {
    asesor: idAsesor,
    nombres: "Juansecito",
    apellidos: "Rod",
    tipoDocumento: "TI",
    numeroDocumento: numeroDocumento,
    clave: "Juancesito12345",
    saldo: 10000000,
    capacidadPrestamo: 100
};

const camposEsperados = {
    nombres: "Juansecito",
    apellidos: "Rod",
    tipoDocumento: "TI",
    numeroDocumento: numeroDocumento,
    clave: "Juancesito12345",
    saldo: 10000000,
    deuda: 0,
    capacidadPrestamo: 100,
    estado: "ACTIVO",
    tasaPreferencial: 1,
    usarTasaPreferencial: false,
    tasaVenta: 1,
    giros: []
};

describe("POST: Eliminar Usuario", () => {
    it("Inicia sesion como asesor", (done) => {
        request
            .post("/")
            .send({
                query: iniciarSesionComoAsesor
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);
                expect(res.body.data.login.token).to.be.a("string");
                tokenAsesor = res.body.data.login.token;
                idAsesor = JSON.parse(atob(tokenAsesor.split('.')[1])).uid;
                done();
            });
    });

    it("Inicia sesion como asesor", (done) => {
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
                tokenAdmin= res.body.data.login.token;
                done();
            });
    });

    it("Crear un usuario como asesor", (done) => {
        request
            .post("/")
            .send({
                query: CREAR_USUARIO,
                variables: {...datosCrearUsuario, asesor: idAsesor}
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);

                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('usuario');

                const { usuario } = res.body.data;
                expect(usuario).to.be.a("object");
                idUsuario = usuario.id;
                done();
            });
    });
    it("Obtener usuarios y buscar el nuevo usuario creado", (done) => {
        request
            .post("/")
            .send({
                query: OBTENER_USUARIOS
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);

                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('usuarios');

                const { usuarios } = res.body.data;
                expect(usuarios).to.be.a("array");

                const usuario = usuarios.find(usuario => usuario.numeroDocumento == numeroDocumento);
                expect(usuario.numeroDocumento).to.equal(numeroDocumento);
                done();
            });
    });
    it(`Eliminar el usuario`, (done) => {
        request
            .post("/")
            .send({
                query: ELIMINAR_USUARIO,
                variables: {
                    id: idUsuario
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);

                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('usuario');
                const { usuario } = res.body.data;
                expect(usuario).to.be.a("object");

                for (const prop in camposEsperados) {
                    expect(usuario).to.have.property(prop);
                    if (prop == 'clave') {
                        expect(usuario[prop]).to.be.a("string");
                        expect(usuario[prop]).to.have.lengthOf(60);
                        continue;
                    };
                    if (prop == 'giros') {
                        expect(usuario[prop]).to.be.a("array");
                        expect(usuario[prop]).to.have.lengthOf(0);
                        continue;
                    };
                    expect(usuario[prop]).to.equal(camposEsperados[prop]);
                };
                done();
            });
    });
    it("Obtener usuarios y no encontrar el usuario eliminado", (done) => {
        request
            .post("/")
            .send({
                query: OBTENER_USUARIOS
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);

                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('usuarios');

                const { usuarios } = res.body.data;
                expect(usuarios).to.be.a("array");

                for (const usuario of usuarios) {
                    expect(usuario.numeroDocumento).to.not.equal(numeroDocumento);
                };
                const usuario = usuarios.find(usuario => usuario.numeroDocumento == numeroDocumento);
                if(usuario) expect(usuario.numeroDocumento).to.equal(undefined);
                done();
            });
    });
});