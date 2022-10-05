import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import {usuario, claveUsuario, asesor, claveAsesor, admin, claveAdmin } from "../../../constants/cuentas";
import { iniciarSesionComoAdmin, iniciarSesionComoAsesor, iniciarSesionComoUsuario } from "../../../constants/login";
chai.use(chaiGraphQL);
const supertest = require("supertest");

const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;

const credencialesCorrectasAdministrador = `
    mutation{
        login(numeroDocumento: "${admin}", clave: "${claveAdmin}"){
            token
        }
    }
`;
const credencialesCorrectasAsesor = `
    mutation{
        login(numeroDocumento: "${asesor}", clave: "${claveAsesor}"){
            token
        }
    }
`;
const credencialesCorrectasUsuario = `
    mutation{
        login(numeroDocumento: "${usuario}", clave: "${claveUsuario}"){
            error
            token
        }
    }
`;
const claveIncorrecta = `
    mutation{
        login(numeroDocumento: "admin", clave:"12345"){
            error
        }
    }
`;
const numeroDocumentoIncorrecto = `
    mutation{
        login(numeroDocumento: "54984216", clave:"uT9pL6iuHClcT1z"){
            error
        }
    }
`;
describe("POST Request", () => {
    it("Rechaza el inicio de sesion cuando la contraseña es incorrecta", (done) => {
        request
            .post("/")
            .send({
                query: claveIncorrecta
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data.login.error).to.equal("Usuario o contraseña incorrectos");
                done();
            })
    }, 30000);
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
    }, 30000);
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
    }, 30000);
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
    }, 30000);
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
    }, 30000);
});