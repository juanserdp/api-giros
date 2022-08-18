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
const obtenerUsuarios = `
query {
    obtenerUsuarios{
        id
        nombres,
        apellidos,
        tipoDocumento,
        numeroDocumento,
        clave,
        saldo,
        giros{
            id
            nombres
            apellidos,
            tipoDocumento,
            numeroDocumento,
            banco,
            tipoCuenta,
            numeroCuenta,
            valorGiro,
            comprobantePago
        }
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
    it("Obtiene los usuarios como de administrador (+token)", (done) => {
        request
            .post("/")
            .send({
                query: obtenerUsuarios
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('obtenerUsuarios');
                const { obtenerUsuarios } = res.body.data;
                const usuarios = obtenerUsuarios;
                expect(obtenerUsuarios).to.be.a("array");

                if (usuarios.length > 0) {
                    usuarios.forEach((usuario) => {
                        for (const property in usuarioSchema) {
                            expect(usuario).to.have.property(`${property}`);
                        }
                        if (usuario.giros.length > 0) {
                            usuario.giros.forEach((giro) => {
                                for (const property in giroSchema) {
                                    expect(usuario.giros).to.have.property(`${property}`);
                                }
                            });
                        };
                    });
                };
                assert.graphQL(res.body);
                done();
            });
    });
    it("No obtiene los usuarios sin token", (done) => {
        request
            .post("/")
            .send({
                query: obtenerUsuarios
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('errors');
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
    it("No obtiene los usuarios como usuario(+token)", (done) => {
        request
            .post("/")
            .send({
                query: obtenerUsuarios
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