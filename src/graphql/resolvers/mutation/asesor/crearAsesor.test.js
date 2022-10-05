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
    it("Crear un asesor como administrador", (done) => {
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

                for(const prop in camposEsperados){
                    expect(asesor).to.have.property(prop);
                    if(prop == 'clave'){
                        expect(asesor[prop]).to.be.a("string");
                        expect(asesor[prop]).to.have.lengthOf(60);
                        continue;
                    };
                    if(prop == 'usuarios'){
                        expect(asesor[prop]).to.be.a("array");
                        expect(asesor[prop]).to.have.lengthOf(0);
                        continue;
                    };
                    expect(asesor[prop]).to.equal(camposEsperados[prop]);
                };
                done();
            });
    }, 30000);
    it("Obtener un error si el numero de documento se repite", (done)=>{
        request
            .post("/")
            .send({
                query: CREAR_ASESOR,
                variables: {
                    nombres: "Andres",
                    apellidos: "Arias",
                    tipoDocumento: "Cedula",
                    numeroDocumento: "1111111132",
                    clave: "12345",
                    saldo: 100500
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
                expect(message).to.equal("Error: El asesor ya existe!");
                done();
            });
    }, 30000)
});