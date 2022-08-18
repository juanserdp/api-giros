import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import {Usuario as usuarioSchema} from "../../../../models/Usuario";
import {Giro as giroSchema} from "../../../../models/Giro";
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
const correctCredentialsAdmin = `
    mutation{
        login(numeroDocumento: "admin", clave:"uT9pL6iuHClcT1z"){
            token
        }
    }
`;
const correctCredentialsUsuario = `
    mutation{
        login(numeroDocumento: "1095", clave:"12345"){
            token
        }
    }
`;
const correctId = "62f854ab7c8bb7b23de4a269";
const obtenerGirosPorIdCorrect = `
query{
    obtenerGirosPorIdUsuario(id: "${correctId}"){
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
            comprobantePago
    }
}`;
const incorrectId = "123456789012345678901234";
const obtenerGirosPorIdIncorrect = `
query{
    obtenerGirosPorIdUsuario(id: "${incorrectId}"){
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
            comprobantePago
    }
}`;
describe("POST Request", () => {
    it("Inicia sesion como administrador y retorna un token si las credenciales son correctas", (done) => {
        request
            .post("/")
            .send({
                query: correctCredentialsAdmin
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
    it("Obtiene todos los giros de un usuario como administrador (+token)", (done) => {
        request
            .post("/")
            .send({
                query: obtenerGirosPorIdCorrect
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('obtenerGirosPorIdUsuario');
                const { obtenerGirosPorIdUsuario } = res.body.data;
                const giros = obtenerGirosPorIdUsuario;
                expect(giros).to.be.a("array");
                if (giros.length > 0) {
                    giros.forEach(giro => {
                        expect(giro).to.be.a("object");
                        for (const property in giroSchema) {
                            expect(giro).to.have.property(`${property}`);
                        }
                    });
                };
                assert.graphQL(res.body);
                done();
            });
    });
    it("No obtiene los giros de un usuario, con un id incorrecto como administrador (+token)", (done) => {
        request
            .post("/")
            .send({
                query: obtenerGirosPorIdIncorrect
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.be.a('array');
                expect(res.body.errors[0]).to.have.property('message');
                expect(res.body.errors[0].message).to.equal(`Error: Ocurrio un error al intentar obtener los giros del usuario con id: ${incorrectId}, porfavor revise que el id proporcionado exista.`);
                assert.graphQLError(res.body);
                done();
            });
    });
    it("No obtiene los giros de un usuario sin token", (done) => {
        request
            .post("/")
            .send({
                query: obtenerGirosPorIdCorrect
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.be.a('array');
                expect(res.body.errors[0]).to.have.property('message');
                expect(res.body.errors[0].message).to.equal("No estas autorizado!");
                assert.graphQLError(res.body);
                done();
            });
    });
    it("Inicia sesion como usuario y retorna un token si las credenciales son correctas", (done) => {
        request
            .post("/")
            .send({
                query: correctCredentialsUsuario
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data.login.token).to.be.a("string");
                tokenUsuario = res.body.data.login.token;
                assert.graphQL(res.body);
                done();
            });
    });
    it("No obtiene los giros de un usuario como usuario(+token)", (done) => {
        request
            .post("/")
            .send({
                query: obtenerGirosPorIdCorrect
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenUsuario, { type: 'bearer' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.be.a('array');
                expect(res.body.errors[0]).to.have.property('message');
                expect(res.body.errors[0].message).to.equal("No estas autorizado!");
                assert.graphQLError(res.body);
                done();
            });
    });
});