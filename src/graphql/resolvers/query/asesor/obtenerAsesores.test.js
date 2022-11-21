import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { usuarioCamposGql } from "../../../../constants/camposGraphql";
import { iniciarSesionComoAdmin } from "../../../../constants/login";
import { Asesor as asesorSchema } from "../../../../models/Asesor";
import { Usuario as usuarioSchema } from "../../../../models/Usuario";

chai.use(chaiGraphQL);
const supertest = require("supertest");

const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;

let tokenAdmin = "";

const OBTENER_ASESORES = `
query{
    asesores: obtenerAsesores{
        id
        nombres
        apellidos
        tipoDocumento
        numeroDocumento
        clave
        saldo
        estado
        tasaVenta
        valorMinimoGiro
        tasaPreferencial
        usarTasaPreferencial
        usuarios{
            id
            nombres
            apellidos
            tipoDocumento
            numeroDocumento
            clave
            saldo
            deuda
            capacidadPrestamo
            estado
            tasaPreferencial
            usarTasaPreferencial
        }
        
    }
}`;

describe("POST: Obtener Asesores", () => {
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
    });
    it("Obtener asesores como administrador", (done) => {
        request
            .post("/")
            .send({
                query: OBTENER_ASESORES
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);

                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('asesores');

                const { asesores } = res.body.data;
                expect(asesores).to.be.a("array");

                for (const asesor of asesores) {
                    for (const prop in asesorSchema) {
                        expect(asesor).to.have.property(prop);
                        if (prop == 'nombres') expect(asesor[prop]).to.be.a("string");
                        else if (prop == 'apellidos') expect(asesor[prop]).to.be.a("string");
                        else if (prop == 'tipoDocumento') expect(asesor[prop]).to.be.a("string");
                        else if (prop == 'numeroDocumento') expect(asesor[prop]).to.be.a("string");
                        else if (prop == 'clave') {
                            expect(asesor[prop]).to.be.a("string");
                            expect(asesor[prop]).to.have.lengthOf(60);
                        }
                        else if (prop == 'saldo') expect(asesor[prop]).to.be.a("number");
                        else if (prop == 'usuarios') {
                            expect(asesor[prop]).to.be.a("array");
                            for(const prop in usuarioSchema){
                                expect(asesor.usuarios).to.have.property(prop);
                            }
                        }
                        else if (prop == 'estado') expect(asesor[prop]).to.be.a("string");
                        else if (prop == 'tasaVenta') expect(asesor[prop]).to.be.a("number");
                    };
                };
                done();
            });
    });
});