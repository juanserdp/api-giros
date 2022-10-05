import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import {Giro as giroSchema} from "../../../../models/Giro";
import { iniciarSesionComoAdmin } from "../../../../constants/login";
chai.use(chaiGraphQL);
const supertest = require("supertest");

const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;

const user = "";
const clave = "";
let tokenAdmin;
let tokenUsuario;
const OBTENER_GIROS = `
    query {
        giros: obtenerGiros{
                id,
                usuario,
                nombres,
                apellidos,
                tipoDocumento,
                numeroDocumento,
                banco,
                tipoCuenta,
                numeroCuenta,
                valorGiro,
                comprobantePago,
                fechaEnvio,
                tasaCompra,
                estadoGiro
        }
    }
`;
describe("POST Request", () => {
    it("Inicia sesion como administrador", (done) => {
        request
            .post("/")
            .send({
                query: iniciarSesionComoAdmin
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data.login.token).to.be.a("string");
                tokenAdmin = res.body.data.login.token;
                assert.graphQL(res.body);
                done();
            });
    }, 30000);
    it("Obtiene los giros como administrador (+token)", (done) => {
        request
            .post("/")
            .send({
                query: OBTENER_GIROS
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('giros');
                const { giros } = res.body.data;
                expect(giros).to.be.a("array");
                if (giros.length > 0) {
                    for(const giro of giros){
                        for (const prop in giroSchema) {
                            expect(giro).to.have.property(prop);
                        };
                    }
                };
                assert.graphQL(res.body);
                done();
            });
    }, 30000);
});