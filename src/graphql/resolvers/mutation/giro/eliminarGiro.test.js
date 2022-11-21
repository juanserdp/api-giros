import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { iniciarSesionComoAdmin, iniciarSesionComoAsesor } from "../../../../constants/login";
import { v4 as uuidv4 } from 'uuid';
import { giroCamposGql, usuarioCamposGql } from "../../../../constants/camposGraphql";
var atob = require('atob');

chai.use(chaiGraphQL);
const supertest = require("supertest");

const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;

let tokenAsesor = "";
let tokenUsuario = "";

let idUsuario = "";
let idAsesor = "";
let idGiro = "";

const numeroDocumento = uuidv4();

const CREAR_GIRO = `
mutation CrearGiro(
    $usuario: ID!,
    $nombres: String!,
    $apellidos: String!,
    $tipoDocumento: String!,
    $numeroDocumento: String!,
    $banco:String!,
    $tipoCuenta: String!,
    $numeroCuenta: String!,
    $valorGiro: Float!
){
    giro: crearGiro(
        usuario: $usuario,
        nombres: $nombres,
        apellidos:$apellidos,
        tipoDocumento:$tipoDocumento,
        numeroDocumento:$numeroDocumento,
        banco:$banco,
        tipoCuenta:$tipoCuenta,
        numeroCuenta:$numeroCuenta,
        valorGiro:$valorGiro
        ){
                ${giroCamposGql}
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

const EDITAR_GIRO = `
    mutation EditarGiro(
        $id: ID!,
        $giro: GiroForUpdateInput!
    ){
        giro: editarGiro(
            id:$id,
            giro:$giro
            ){
                ${giroCamposGql}
        }
    }
`;

const ELIMINAR_GIRO = `
    mutation EliminarGiro($id:ID!){
        giro: eliminarGiro(id:$id){
                ${giroCamposGql}
        }
    }
`;


describe("POST: Eliminar Giro", () => {
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

    it("Crear un usuario", (done) => {
        request
            .post("/")
            .send({
                query: CREAR_USUARIO,
                variables: {
                    asesor: idAsesor,
                    nombres: "Juansecito",
                    apellidos: "Rod",
                    tipoDocumento: "TI",
                    numeroDocumento: numeroDocumento,
                    clave: "Juancesito12345",
                    saldo: 10000000,
                    capacidadPrestamo: 100
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);
                done();
            });
    });

    it("Inicia sesion como usuario", (done) => {
        request
            .post("/")
            .send({
                query: `
                mutation{
                    login(numeroDocumento: "${numeroDocumento}", clave: "Juancesito12345"){
                        error
                        token
                    }
                }
            `
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);
                expect(res.body.data.login.token).to.be.a("string");
                tokenUsuario = res.body.data.login.token;
                idUsuario = JSON.parse(atob(tokenUsuario.split('.')[1])).uid;
                done();
            });
    });

    it("Enviar giro", (done) => {
        request
            .post("/")
            .send({
                query: CREAR_GIRO,
                variables: {
                    usuario: idUsuario,
                    nombres: "giro5",
                    apellidos: "luna0007",
                    tipoDocumento: "cedul8",
                    numeroDocumento: "10972",
                    banco: "bbva2",
                    tipoCuenta: "ahorros",
                    numeroCuenta: "2381932",
                    valorGiro: 10000
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenUsuario, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);

                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('giro');

                const { giro } = res.body.data;
                expect(giro).to.be.a("object");
                idGiro = giro.id;
                done();
            });
    });

    it("Obtener un error al eliminar un giro con estado: ENVIADO", (done) => {
        request
            .post("/")
            .send({
                query: ELIMINAR_GIRO,
                variables: {
                    id: idGiro
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(500)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQLError(res.body);
                expect(res.body).to.be.graphQLError()
                assert.graphQLError(res.body, 'Error: No se pudo eliminar el giro porque su estado es: PENDIENTE!')
                done();
            });
    });

    it("Editar giro", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_GIRO,
                variables: {
                    id: idGiro,
                    giro: {
                        estadoGiro: "COMPLETADO"
                    }
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);
                done();
            });
    });

    it("Eliminar giro", (done) => {
        request
            .post("/")
            .send({
                query: ELIMINAR_GIRO,
                variables: {
                    id: idGiro
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);
                done();
            });
    });
});