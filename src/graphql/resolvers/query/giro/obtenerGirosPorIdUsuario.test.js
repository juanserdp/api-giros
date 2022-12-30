import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import {Giro as giroSchema} from "../../../../models/Giro";
import { iniciarSesionComoAdmin } from "../../../../constants/login";
import { giroCamposGql } from "../../../../constants/camposGraphql";
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
const OBTENER_GIROS_ID_USUARIO = `
    query ObtenerGirosPorIdUsuario($id: ID!){
        giros: obtenerGirosPorIdUsuario(id: $id){
            ${giroCamposGql}
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
    });
    it("Obtiener los giros por usuario", (done) => {
        request
            .post("/")
            .send({
                query: OBTENER_GIROS_ID_USUARIO,
                variables: {
                    id: "632932d035cd6137b26be9e7"
                }
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
    });
});