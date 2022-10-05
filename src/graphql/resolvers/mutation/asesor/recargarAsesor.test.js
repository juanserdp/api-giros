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
}
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
                id
                nombres
                apellidos
                tipoDocumento
                numeroDocumento
                clave
                saldo
                usuarios{
                    id
                }
                estado
                tasaVenta
            }
        }
`;
const numeroDocumento = uuidv4();
const camposIngresadosCrearAsesor = {
    nombres: "AndresRA",
    apellidos: "AriasRA",
    tipoDocumento: "Cedula",
    numeroDocumento: numeroDocumento,
    clave: "12345",
    saldo: 100500
};
const camposEsperadosCrearAsesor = {
    nombres: "AndresRA",
    apellidos: "AriasRA",
    tipoDocumento: "Cedula",
    numeroDocumento: numeroDocumento,
    clave: "12345",
    saldo: 100500,
    usuarios: [],
    estado: "ACTIVO",
    tasaVenta: 0
};
const EDITAR_ASESOR = `
mutation RecargarAsesor(
    $numeroDocumento: String!,
    $valorRecarga: Float!
){
    asesor: recargarAsesor(
        numeroDocumento: $numeroDocumento,
        valorRecarga: $valorRecarga
        ){
        saldo
    }
}
`;
const camposParaRecargarAsesor = {
    numeroDocumento: numeroDocumento,
    valorRecarga: 20000
};
const camposEsperadosDeRecargarAsesor = {
    saldo: 120500
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
    }, 30000);
    it(`Crear un asesor como administrador`, (done) => {
        request
            .post("/")
            .send({
                query: CREAR_ASESOR,
                variables: camposIngresadosCrearAsesor
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosCrearAsesor));
    }, 30000);
    it("Recargar el asesor como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR,
                variables: camposParaRecargarAsesor
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosDeRecargarAsesor));
    }, 30000);
});