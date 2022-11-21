import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { iniciarSesionComoAdmin } from "../../../../constants/login";
import { v4 as uuidv4 } from 'uuid';
import { asesorCamposGql } from "../../../../constants/camposGraphql";

chai.use(chaiGraphQL);
const supertest = require("supertest");
const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;

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
};

let tokenAdmin = "";

let idAsesor = "";

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
    mutation EditarAsesor(
        $id: ID!
        $asesor: AsesorForUpdateInput!
    ){
        asesor: editarAsesor(
            id: $id,
            asesor: $asesor
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

const datosEditarAsesor = {
    nombres: "Juanse",
    apellidos: "Rodriguez",
    tipoDocumento: "CC",
    numeroDocumento: "12345678901234567890",
    clave: "Colombia123456789",
    saldo: 123456,
    estado: "INACTIVO",
    tasaVenta: 0.02,
    valorMinimoGiro: 2,
    tasaPreferencial: 2,
    usarTasaPreferencial: true
};

const datosEditarDatosPersonalesAsesor = {
    nombres: "Sebitas",
    apellidos: "Rodriguez",
    tipoDocumento: "Tarjeta de Identidad",
    numeroDocumento: numeroDocumento + "012345"
};

const datosEditarClaveAsesor = {
    clave: "MExicooo1234"
};

const datosEditarTasaVentaAsesor = {
    tasaVenta: 650
};

const datosEditarValorMinimoGiro = {
    valorMinimoGiro: 6
};

describe("POST: Editar Asesor", () => {
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

    it("Editar el asesor como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR,
                variables: {
                    id: idAsesor,
                    asesor: datosEditarAsesor
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, datosEditarAsesor));
    });

    it("Obtener un error si el numero de documento se repite", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR,
                variables: {
                    id: idAsesor,
                    asesor: { ...datosEditarAsesor, numeroDocumento: "admin" }
                }
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
                expect(message).to.equal("Error: Ya existe un asesor con ese numero de documento!");
                done();
            });
    });

    it("Editar los datos personales como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR,
                variables: {
                    id: idAsesor,
                    asesor: datosEditarDatosPersonalesAsesor
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, datosEditarDatosPersonalesAsesor));
    });

    it("Editar la contraseña como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR,
                variables: {
                    id: idAsesor,
                    asesor: datosEditarClaveAsesor
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, datosEditarClaveAsesor));
    });

    it("Editar la tasa de venta como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR,
                variables: {
                    id: idAsesor,
                    asesor: datosEditarTasaVentaAsesor
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, datosEditarTasaVentaAsesor));
    });

    it("Editar el valor minimo de un giro como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR,
                variables: {
                    id: idAsesor,
                    asesor: datosEditarValorMinimoGiro
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, datosEditarValorMinimoGiro));
    });
});