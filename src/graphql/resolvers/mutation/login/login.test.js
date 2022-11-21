import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { iniciarSesionComoAdmin, iniciarSesionComoAsesor, iniciarSesionComoUsuario } from "../../../../constants/login";

chai.use(chaiGraphQL);
const supertest = require("supertest");

const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;

const claveIncorrectaAdmin = `
    mutation{
        login(numeroDocumento: "admin", clave:"12345"){
            error
        }
    }
`;

const numeroDocumentoIncorrecto = `
    mutation{
        login(numeroDocumento: "54984232532sfsf234216", clave:"Colombianito12345"){
            error
        }
    }
`;

const claveIncorrectaAsesor = `
    mutation{
        login(numeroDocumento: "asesor", clave:"12345"){
            error
        }
    }
`;

const claveIncorrectaUsuario= `
    mutation{
        login(numeroDocumento: "asesor", clave:"12345"){
            error
        }
    }
`;

describe("POST Request", () => {
    it("Rechaza el inicio de sesion cuando la contraseña es incorrecta como admin", (done) => {
        request
            .post("/")
            .send({
                query: claveIncorrectaAdmin
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data.login.error).to.equal("Usuario o contraseña incorrectos");
                done();
            })
    });

    it("Rechaza el inicio de sesion cuando la contraseña es incorrecta como asesor", (done) => {
        request
            .post("/")
            .send({
                query: claveIncorrectaAsesor
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data.login.error).to.equal("Usuario o contraseña incorrectos");
                done();
            })
    });

    it("Rechaza el inicio de sesion cuando la contraseña es incorrecta como usuario", (done) => {
        request
            .post("/")
            .send({
                query: claveIncorrectaUsuario
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data.login.error).to.equal("Usuario o contraseña incorrectos");
                done();
            })
    });



    it("Rechaza el inicio de sesion cuando el numeroDocumento no existe", (done) => {
        request
            .post("/")
            .send({
                query: numeroDocumentoIncorrecto
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data.login.error).to.equal("Usuario o contraseña incorrectos");
                done();
            })
    });
    
    it("Acepta el inicio de sesion, y retorna un token como administrador", (done) => {
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
                assert.graphQL(res.body);
                done();
            })
    });

    it("Acepta el inicio de sesion, y retorna un token como asesor", (done) => {
        request
            .post("/")
            .send({
                query: iniciarSesionComoAsesor
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data.login.token).to.be.a("string");
                assert.graphQL(res.body);
                done();
            })
    });

    it("Acepta el inicio de sesion, y retorna un token como usuario", (done) => {
        request
            .post("/")
            .send({
                query: iniciarSesionComoUsuario
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data.login.token).to.be.a("string");
                assert.graphQL(res.body);
                done();
            })
    });
});