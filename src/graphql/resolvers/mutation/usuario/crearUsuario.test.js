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

let tokenAsesor = "";
let idAsesor = "";

const numeroDocumento = uuidv4();

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
    giros: []
};

describe("POST: Crear Usuario", () => {
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

    it("Obtener un error si el numero de documento se repite", (done) => {
        request
            .post("/")
            .send({
                query: CREAR_USUARIO,
                variables: {...datosCrearUsuario, asesor: idAsesor}
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(500)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQLError(res.body);
                expect(res.body).to.have.property('errors');

                expect(res.body.errors).to.be.a("array");
                expect(res.body.errors).to.have.lengthOf(1);

                const { message } = res.body.errors[0];
                expect(message).to.be.a("string");
                expect(message).to.equal("Error: El usuario ya existe!");
                done();
            });
    })
});