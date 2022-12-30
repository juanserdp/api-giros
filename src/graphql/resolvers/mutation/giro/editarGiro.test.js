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

let idAsesor = "";
let idUsuario = "";
let idGiro = "";

const numeroDocumento = uuidv4();

const CREAR_GIRO = `
mutation CrearGiro(
    $usuario: ID!,
    $nombres: String!,
    $nombresRemitente: String!,
    $apellidos: String!,
    $apellidosRemitente: String!,
    $tipoDocumento: String!,
    $tipoDocumentoRemitente: String!,
    $numeroDocumento: String!,
    $numeroDocumentoRemitente: String!,
    $banco:String!,
    $tipoCuenta: String!,
    $numeroCuenta: String!,
    $valorGiro: Float!,
    $tasaCompra: Float!
){
    giro: crearGiro(
        usuario: $usuario,
        nombres: $nombres,
        nombresRemitente: $nombresRemitente,
        apellidos: $apellidos,
        apellidosRemitente: $apellidosRemitente,
        tipoDocumento: $tipoDocumento,
        tipoDocumentoRemitente: $tipoDocumentoRemitente,
        numeroDocumento: $numeroDocumento,
        numeroDocumentoRemitente: $numeroDocumentoRemitente,
        banco:$banco,
        tipoCuenta:$tipoCuenta,
        numeroCuenta:$numeroCuenta,
        valorGiro:$valorGiro,
        tasaCompra: $tasaCompra
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

const datosEditarGiro = {
    nombres: "nombresEditado",
    apellidos: "apellidosEditado",
    tipoDocumento: "tipoEditado",
    numeroDocumento: "numeroEditado",
    banco: "banco Popular",
    tipoCuenta: "ahorros",
    numeroCuenta: "12334234",
};

const datosEditarComprobantePagoGiro = {
    comprobantePago: "354sf6s4dfa-asdf"
};

describe("POST: Editar Giro", () => {
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

    it("Enviar giro como usuario", (done) => {
        request
            .post("/")
            .send({
                query: CREAR_GIRO,
                variables: {
                    usuario: idUsuario,
                    nombres: "giro5",
                    nombresRemitente: "juan",
                    apellidos: "luna0007",
                    apellidosRemitente: "saitama",
                    tipoDocumento: "cedul8",
                    tipoDocumentoRemitente: "cedul8",
                    numeroDocumento: "10972",
                    numeroDocumentoRemitente: "10972123",
                    banco: "bbva2",
                    tipoCuenta: "ahorros",
                    numeroCuenta: "2381932",
                    valorGiro: 10000,
                    tasaCompra: 1
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

    it("Editar giro", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_GIRO,
                variables: {
                    id: idGiro,
                    giro: datosEditarGiro
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

                for (const prop in datosEditarGiro) {
                    expect(giro).to.have.property(prop);
                    expect(giro[prop]).to.equal(datosEditarGiro[prop]);
                };
                done();
            });
    });

    it("Editar comprobante de pago del giro", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_GIRO,
                variables: {
                    id: idGiro,
                    giro: datosEditarComprobantePagoGiro
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

                for (const prop in datosEditarComprobantePagoGiro) {
                    expect(giro).to.have.property(prop);
                    expect(giro[prop]).to.equal(datosEditarComprobantePagoGiro[prop]);
                };
                done();
            });
    });
});