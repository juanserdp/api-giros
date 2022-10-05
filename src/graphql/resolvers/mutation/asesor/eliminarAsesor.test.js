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
let idAsesor = "";
const OBTENER_ASESORES = `
query{
    asesores: obtenerAsesores{
        id
        nombres
        apellidos
        tipoDocumento
        numeroDocumento
        clave
        saldo
        estado
        tasaVenta
    }
}`;
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
const ELIMINAR_ASESOR = `
mutation EliminarAsesor($id: ID!){
    asesor: eliminarAsesor(id: $id){
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
const camposIngresados = {
    nombres: "Andres",
    apellidos: "Arias",
    tipoDocumento: "Cedula",
    numeroDocumento: numeroDocumento,
    clave: "12345",
    saldo: 100500
};
const camposEsperados = {
    nombres: "Andres",
    apellidos: "Arias",
    tipoDocumento: "Cedula",
    numeroDocumento: numeroDocumento,
    clave: "12345",
    saldo: 100500,
    usuarios: [],
    estado: "ACTIVO",
    tasaVenta: 0
};
describe("POST: Crear Asesor", () => {
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
    it(`Crear un asesor con num documento: ${numeroDocumento} como administrador`, (done) => {
        request
            .post("/")
            .send({
                query: CREAR_ASESOR,
                variables: camposIngresados
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

                for (const prop in camposEsperados) {
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
                    expect(asesor[prop]).to.equal(camposEsperados[prop]);
                };
                done();
            });
    }, 30000);
    it("Obtener asesores y buscar el nuevo asesor creado", (done) => {
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

                const asesor = asesores.find(asesor => asesor.numeroDocumento == numeroDocumento);
                expect(asesor.numeroDocumento).to.equal(numeroDocumento);
                done();
            });
    }, 30000);
    it(`Eliminar usuario con num documento: ${numeroDocumento}`, (done) => {
        request
            .post("/")
            .send({
                query: ELIMINAR_ASESOR,
                variables: {
                    id: idAsesor
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
                expect(res.body.data).to.have.property('asesor');

                const { asesor } = res.body.data;
                expect(asesor).to.be.a("object");

                for (const prop in camposEsperados) {
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
                    expect(asesor[prop]).to.equal(camposEsperados[prop]);
                };
                done();
            });
    }, 30000);
    it("Obtener asesores y no encontrar el asesor eliminado", (done) => {
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
                    expect(asesor.numeroDocumento).to.not.equal(numeroDocumento);
                };
                const asesor = asesores.find(asesor => asesor.numeroDocumento == numeroDocumento);
                if(asesor) expect(asesor.numeroDocumento).to.equal(undefined);
                done();
            });
    }, 30000);
});