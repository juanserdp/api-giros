import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { iniciarSesionComoAdmin } from "../../../../constants/login";
import { v4 as uuidv4 } from 'uuid';
import { asesorCamposGql } from "../../../../constants/camposGraphql";
chai.use(chaiGraphQL);
const supertest = require("supertest");
function revisarCamposEspecificos(error, res, done, campos, assert) {
    if (error) return done(error);
    assert.graphQL(res.body);

    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('asesor');

    const { asesor } = res.body.data;
    expect(asesor).to.be.a("object");

    for (const prop in campos) {
        expect(asesor).to.have.property(prop);
        if (prop == 'clave') {
            expect(asesor[prop]).to.be.a("string");
            expect(asesor[prop]).to.have.lengthOf(60);
            continue;
        };
        if (prop == 'usuarios') {
            expect(asesor[prop]).to.be.a("array");
            expect(asesor[prop]).to.have.lengthOf(0);
            continue;
        };
        expect(asesor[prop]).to.equal(campos[prop]);
    };
    done();
};
const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;
let tokenAdmin = "";

const numeroDocumento = uuidv4();

const CREAR_ASESOR = `
    mutation CrearAsesor(
        $nombres: String!
        $apellidos: String!
        $tipoDocumento: String!
        $numeroDocumento: String!
        $clave: String!
        $saldo: Float!
        ){
        asesor: crearAsesor(
            nombres: $nombres,
            apellidos: $apellidos,
            tipoDocumento: $tipoDocumento,
            numeroDocumento: $numeroDocumento,
            clave: $clave,
            saldo: $saldo,
            ){
                ${asesorCamposGql}
            }
        }
`;

const EDITAR_ASESOR = `
mutation RecargarAsesor(
    $numeroDocumento: String!,
    $valorRecarga: Float!
){
    asesor: recargarAsesor(
        numeroDocumento: $numeroDocumento,
        valorRecarga: $valorRecarga
        ){
            ${asesorCamposGql}
    }
}
`;

const datosCrearAsesor = {
    nombres: "Andres",
    apellidos: "Arias",
    tipoDocumento: "Cedula",
    numeroDocumento: numeroDocumento,
    clave: "Colombia12345",
    saldo: 100500
};

const datosRecargarAsesor = {
    numeroDocumento: numeroDocumento,
    valorRecarga: 20000
};

const camposEsperados = {
    nombres: "Andres",
    apellidos: "Arias",
    tipoDocumento: "Cedula",
    numeroDocumento: numeroDocumento,
    clave: "Colombia12345",
    saldo: 120500,
    usuarios: [],
    estado: "ACTIVO",
    tasaVenta: 1,
    valorMinimoGiro: 1,
    tasaPreferencial: 1,
    usarTasaPreferencial: false
};

describe("POST: Recargar Asesor", () => {
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
    });
    it(`Crear un asesor como administrador`, (done) => {
        request
            .post("/")
            .send({
                query: CREAR_ASESOR,
                variables: datosCrearAsesor
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, datosCrearAsesor, assert));
    });
    it("Recargar el asesor como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR,
                variables: datosRecargarAsesor
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperados, assert));
    });
});