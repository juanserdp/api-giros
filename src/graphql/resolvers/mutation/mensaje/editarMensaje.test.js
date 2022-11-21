import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { iniciarSesionComoAdmin } from "../../../../constants/login";
import { mensajeCamposGql } from "../../../../constants/camposGraphql";
chai.use(chaiGraphQL);
const supertest = require("supertest");

const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;
let tokenAdmin = "";
let idMensaje = "";
const CREAR_MENSAJE = `
mutation CrearMensaje(
    $mensaje: String!
    ){
    mensaje: crearMensaje(
        mensaje: $mensaje,
        ){
            ${mensajeCamposGql}
        }
    }
`;

const EDITAR_MENSAJE =  `
mutation EditarMensaje(
    $id: ID!,
    $mensaje: MensajeForUpdateInput!
    ){
    mensaje: editarMensaje(
        id: $id,
        mensaje: $mensaje,
        ){
            ${mensajeCamposGql}
        }
    }
`;

const datosEditarMensaje = {
    mensaje: "Mensaje Editado",
};

const camposEsperados = {
    mensaje: "Mensaje Editado",
    fechaCreacion: (new Date()).toLocaleDateString(),
    fechaUltimaModificacion: (new Date()).toLocaleDateString(),
};

describe("POST: Crear Asesor", () => {
    it("Iniciar sesion como administrador", (done) => {
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
    });

    it("Crear un mensaje", (done) => {
        request
            .post("/")
            .send({
                query: CREAR_MENSAJE,
                variables: {
                    mensaje: "Esto es un mensajillo"
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
                expect(res.body.data).to.have.property('mensaje');

                const { mensaje } = res.body.data;
                expect(mensaje).to.be.a("object");
                idMensaje = mensaje.id;
                done();
            });
    });

    it("Editar un mensaje", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_MENSAJE,
                variables: {
                    id: idMensaje,
                    mensaje: datosEditarMensaje
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
                expect(res.body.data).to.have.property('mensaje');

                const { mensaje } = res.body.data;
                expect(mensaje).to.be.a("object");

                for (const prop in camposEsperados) {
                    expect(mensaje).to.have.property(prop);
                    expect(mensaje[prop]).to.equal(camposEsperados[prop]);
                };
                done();
            });
    });
});