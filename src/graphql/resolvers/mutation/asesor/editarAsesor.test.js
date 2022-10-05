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
const EDITAR_ASESOR = `
    mutation EditarAsesor(
        $id: ID!
        $asesor: AsesorForUpdateInput!
    ){
        asesor: editarAsesor(
            id: $id,
            asesor: $asesor
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
let idAsesor = "6321698ff53c4bd357393ac5";
const newNumeroDocumento = numeroDocumento;
const camposEsperadosEditarAsesor = {
    nombres: "Juanse",
    apellidos: "Rodriguez",
    tipoDocumento: "CC",
    numeroDocumento: "94328765032954",
    clave: "12425",
    saldo: 100200,
    estado: "ACTIVO",
    tasaVenta: 0.02
};
const clave = newNumeroDocumento + "32465234/%($(/%"
const EDITAR_ASESOR_DATOS_PERSONALES = `
    mutation EditarAsesor(
        $id: ID!
        $asesor: AsesorForUpdateInput!
    ){
        asesor: editarAsesor(
            id: $id,
            asesor: $asesor
            ){
                id
                nombres
                apellidos
                tipoDocumento
                numeroDocumento
            }
    }
`;
const camposEsperadorDeEditarDatosPersonales = {
    nombres: "Sebitas",
    apellidos: "Pci",
    tipoDocumento: "TI",
    numeroDocumento: newNumeroDocumento + "1231514786"
};
const EDITAR_ASESOR_CLAVE = `
    mutation EditarAsesor(
        $id: ID!
        $asesor: AsesorForUpdateInput!
    ){
        asesor: editarAsesor(
            id: $id,
            asesor: $asesor
            ){
                clave
            }
    }
`;
const camposEsperadosDeEditarClave = {
    clave: "1234513"
};
const EDITAR_ASESOR_SALDO = `
    mutation EditarAsesor(
        $id: ID!
        $asesor: AsesorForUpdateInput!
    ){
        asesor: editarAsesor(
            id: $id,
            asesor: $asesor
            ){
                saldo
            }
    }
`;
const camposEsperadosDeEditarSaldo = {
    saldo: 1234513
};
const EDITAR_ASESOR_ESTADO = `
    mutation EditarAsesor(
        $id: ID!
        $asesor: AsesorForUpdateInput!
    ){
        asesor: editarAsesor(
            id: $id,
            asesor: $asesor
            ){
                estado
            }
    }
`;
const camposEsperadosDeEditarEstado = {
    estado: "ACTIVO"
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
    }, 30000);
    const camposParaEditarDatosPersonales = {
        id: idAsesor,
        asesor: {
            nombres: "Sebitas",
            apellidos: "Pci",
            tipoDocumento: "TI",
            numeroDocumento: newNumeroDocumento + "1231514786"
        }
    };
    const camposParaEditarClave = {
        id: idAsesor,
        asesor: {
            clave: "1234513"
        }
    };
    const camposParaEditarSaldo = {
        id: idAsesor,
        asesor: {
            saldo: 1234513
        }
    };
    const camposParaEditarEstado = {
        id: idAsesor,
        asesor: {
            estado: "ACTIVO"
        }
    };
    const camposParaEditarAsesor = {
        id: idAsesor,
        asesor: {
            nombres: "Juanse",
            apellidos: "Rodriguez",
            tipoDocumento: "CC",
            numeroDocumento: "94328765032954",
            clave: "12425",
            saldo: 100200,
            estado: "ACTIVO",
            tasaVenta: 0.02
        }
    };
    it("Editar el asesor como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR,
                variables: camposParaEditarAsesor
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosEditarAsesor));
    }, 30000);
    it("Obtener un error si el numero de documento se repite", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR,
                variables: camposParaEditarAsesor
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
    }, 30000);

    it("Editar los datos personales como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR_DATOS_PERSONALES,
                variables: camposParaEditarDatosPersonales
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadorDeEditarDatosPersonales));
    }, 30000);
    it("Editar la contraseña como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR_CLAVE,
                variables: camposParaEditarClave
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosDeEditarClave));
    }, 30000);

    it("Editar el estado como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR_ESTADO,
                variables: camposParaEditarEstado
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosDeEditarEstado));
    }, 30000);

    it("Editar el saldo como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_ASESOR_SALDO,
                variables: camposParaEditarSaldo
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosDeEditarSaldo));
    }, 30000);
});