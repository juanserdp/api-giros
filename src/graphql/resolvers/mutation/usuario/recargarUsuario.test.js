import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { iniciarSesionComoAdmin } from "../../../../constants/login";
import { v4 as uuidv4 } from 'uuid';
import { asesorCamposGql, usuarioCamposGql } from "../../../../constants/camposGraphql";
chai.use(chaiGraphQL);
const supertest = require("supertest");
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
};
const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;
const numeroDocumento = uuidv4();

let tokenAdmin = "";
let tokenAsesor = "";
let idAsesor = "";
let idUsuario = "";

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

const OBTENER_ASESORES = `
query{
    asesores: obtenerAsesores{
        ${asesorCamposGql}
    }
}`;

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

const RECARGAR_USUARIO = `
    mutation RecargarUsuario(
        $numeroDocumento: String!,
        $valorRecarga: Float!
    ){
        usuario: recargarUsuario(
            numeroDocumento: $numeroDocumento,
            valorRecarga: $valorRecarga
            ){
            ${usuarioCamposGql}
        }
    }
`;

const datosCrearAsesor = {
    nombres: "Brayan",
    apellidos: "Barrios",
    tipoDocumento: "Cedula",
    numeroDocumento: numeroDocumento,
    clave: "Colombia12345",
    saldo: 125000
};

const camposEsperados = {
    nombres: "Brayan",
    apellidos: "Barrios",
    tipoDocumento: "Cedula",
    numeroDocumento: numeroDocumento,
    clave: "Colombia12345",
    saldo: 100000,
    usuarios: [],
    estado: "ACTIVO",
    tasaVenta: 1,
    valorMinimoGiro: 1,
    tasaPreferencial: 1,
    usarTasaPreferencial: false
};

describe("POST: Recargar Usuario", () => {
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

    it("Crear un asesor como administrador", (done) => {
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
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('asesor');
                const { asesor } = res.body.data;
                expect(asesor).to.be.a("object");
                expect(asesor.usuarios).to.have.lengthOf(0);
                idAsesor = asesor.id;
                done();
            });
    });

    it("Crear un usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: CREAR_USUARIO,
                variables: {
                    asesor: idAsesor,
                    nombres: "usuarioxxx",
                    apellidos: "usuarioxxx",
                    tipoDocumento: "TI",
                    numeroDocumento: numeroDocumento + "01321321",
                    clave: "Colombia123456",
                    saldo: 25000,
                    capacidadPrestamo: 100
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);

                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('usuario');

                const { usuario } = res.body.data;
                expect(usuario).to.be.a("object");
                done();
            });
    });

    it("Recargar el usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: RECARGAR_USUARIO,
                variables: {
                    numeroDocumento: numeroDocumento  + "01321321",
                    valorRecarga: 25000
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, {saldo: 50000}));
    });

    it("Obtener los asesores y corroborar el saldo del asesor", (done) => {
        request
            .post("/")
            .send({
                query: OBTENER_ASESORES
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);

                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('asesores');

                const { asesores } = res.body.data;
                expect(asesores).to.be.a("array");

                for (const asesor of asesores) {
                    if (asesor.id == idAsesor) {
                        for (const prop in asesor) {
                            expect(asesor).to.have.property(prop);
                            if (prop == 'nombres') expect(asesor[prop]).to.be.a("string");
                            else if (prop == 'apellidos') expect(asesor[prop]).to.be.a("string");
                            else if (prop == 'tipoDocumento') expect(asesor[prop]).to.be.a("string");
                            else if (prop == 'numeroDocumento') expect(asesor[prop]).to.be.a("string");
                            else if (prop == 'clave') {
                                expect(asesor[prop]).to.be.a("string");
                                expect(asesor[prop]).to.have.lengthOf(60);
                            }
                            else if (prop == 'saldo') {
                                expect(asesor[prop]).to.be.a("number");
                                expect(asesor[prop]).to.equal(camposEsperados.saldo);
                            }
                            else if (prop == 'usuarios') expect(asesor[prop]).to.be.a("array");
                            else if (prop == 'estado') expect(asesor[prop]).to.be.a("string");
                            else if (prop == 'tasaVenta') expect(asesor[prop]).to.be.a("number");
                        }
                    }
                };
                done();
            });
    });

});