import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { Usuario as usuarioSchema } from "../../../../models/Usuario";
import { Giro as giroSchema } from "../../../../models/Giro";
import { iniciarSesionComoAdmin } from "../../../../constants/login";
chai.use(chaiGraphQL);
const supertest = require("supertest");

const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;
let tokenAdmin = "";

const OBTENER_USUARIOS_POR_ID_ASESOR = `
query ObtenerUsuariosPorIdAsesor($id:ID!){
    usuarios: obtenerUsuariosPorIdAsesor(id:$id){
        id,
        asesor{
            id
        },
        nombres,
        apellidos,
        tipoDocumento,
        numeroDocumento,
        clave,
        saldo,
        deuda,
        capacidadPrestamo,
        estado,
        giros{
            id
        },
        tasaVenta
    }
}
`;

describe("POST: Obtener Usuarios Por Id Asesor", () => {
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
    it("Obtener usuarios como administrador", (done) => {
        request
            .post("/")
            .send({
                query: OBTENER_USUARIOS_POR_ID_ASESOR,
                variables:{
                    id: "6323b8cf0c92ed905057721a"
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
    }, 30000);
});