import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { Usuario as usuarioSchema } from "../../../../models/Usuario";
import { Giro as giroSchema } from "../../../../models/Giro";
import { iniciarSesionComoAdmin, iniciarSesionComoAsesor } from "../../../../constants/login";
import { usuarioCamposGql } from "../../../../constants/camposGraphql";
var atob = require('atob');
chai.use(chaiGraphQL);
const supertest = require("supertest");

const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;
let tokenAsesor = "";
let idAsesor = "";

const OBTENER_USUARIOS_POR_ID_ASESOR = `
query ObtenerUsuariosPorIdAsesor($id:ID!){
    usuarios: obtenerUsuariosPorIdAsesor(id:$id){
        ${usuarioCamposGql}
    }
}
`;

describe("POST: Obtener Usuarios Por Id Asesor", () => {
    it("Inicia sesion como asesor", (done) => {
        request
            .post("/")
            .send({
                query: iniciarSesionComoAsesor
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);
                expect(res.body.data.login.token).to.be.a("string");
                tokenAsesor = res.body.data.login.token;
                idAsesor = JSON.parse(atob(tokenAsesor.split('.')[1])).uid;
                done();
            });
    });
    it("Obtener usuarios como administrador", (done) => {
        request
            .post("/")
            .send({
                query: OBTENER_USUARIOS_POR_ID_ASESOR,
                variables:{
                    id: idAsesor
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);

                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('usuarios');

                const { usuarios } = res.body.data;
                expect(usuarios).to.be.a("array");

                for (const usuario of usuarios) {
                    for (const prop in usuarioSchema) {
                        expect(usuario).to.have.property(prop);
                        if (prop == 'nombres' || prop == 'apellidos' ||
                            prop == 'tipoDocumento' || prop == 'numeroDocumento' ||
                            prop == 'estado') expect(usuario[prop]).to.be.a("string");
                        else if (prop == 'clave') {
                            expect(usuario[prop]).to.be.a("string");
                            expect(usuario[prop]).to.have.lengthOf(60);
                        }
                        else if (prop == 'saldo' || prop == 'tasaVenta' ||
                            prop == 'deuda') expect(usuario[prop]).to.be.a("number");
                        else if (prop == 'giros') {
                            expect(usuario[prop]).to.be.a("array");
                            for (const prop in giroSchema) {
                                expect(usuario.giros).to.have.property(prop);
                            }
                        }
                    };
                };
                done();
            });
    });
});