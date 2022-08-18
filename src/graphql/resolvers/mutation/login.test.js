import chai from "chai";
import chaiGraphQL from 'chai-graphql';
chai.use(chaiGraphQL);
const supertest = require("supertest");

const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;

const user = "admin";
const clave = "uT9pL6iuHClcT1z";

const wrongClave = `
    mutation{
        login(numeroDocumento: "admin", clave:"13245"){
            error
        }
    }
`;
const wrongUsuario = `
    mutation{
        login(numeroDocumento: "ADMIN", clave:"uT9pL6iuHClcT1z"){
            error
        }
    }
`;
const correctCredentials = `
    mutation{
        login(numeroDocumento: "${user}", clave:"${clave}"){
            token
        }
    }
`;

describe("POST Request", () => {
    it("Rechaza el inicio de sesion cuando la contraseña es incorrecta", (done) => {
        request
            .post("/")
            .send({
                query: wrongClave
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data.login.error).to.equal("Usuario o contraseña incorrectos");
                done();
            })
    });
    it("Rechaza el inicio de sesion cuando el usuario no existe", (done) => {
        request
            .post("/")
            .send({
                query: wrongUsuario
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data.login.error).to.equal("Usuario o contraseña incorrectos");
                done();
            })
    });
    it("Acepta el inicio de sesion y retorna un token cuando las credenciales son correctas", (done) => {
        request
            .post("/")
            .send({
                query: correctCredentials
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