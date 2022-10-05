import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { iniciarSesionComoAdmin } from "../../../../constants/login";
import { v4 as uuidv4 } from 'uuid';
chai.use(chaiGraphQL);
const supertest = require("supertest");

const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;
let tokenAdmin = "";
const numeroDocumento = uuidv4();
// let idUsuario = "";
let idAsesor = "";


const CREAR_ASESOR = `
    mutation CrearAsesor(
        $nombres: String!
        $apellidos: String!
        $tipoDocumento: String!
        $numeroDocumento: String!
        $clave: String!
        $saldo: Float!
        ){
        asesor: crearAsesor(
            nombres: $nombres,
            apellidos: $apellidos,
            tipoDocumento: $tipoDocumento,
            numeroDocumento: $numeroDocumento,
            clave: $clave,
            saldo: $saldo,
            ){
                id
                nombres
                apellidos
                tipoDocumento
                numeroDocumento
                clave
                saldo
                usuarios{
                    id
                }
                estado
                tasaVenta
            }
        }
`;
const camposIngresadosCrearAsesor = {
    nombres: "Brayan",
    apellidos: "Barrios",
    tipoDocumento: "Cedula",
    numeroDocumento: numeroDocumento,
    clave: "12345",
    saldo: 125000
};
const camposEsperadosCrearAsesor = {
    nombres: "Brayan",
    apellidos: "Barrios",
    tipoDocumento: "Cedula",
    numeroDocumento: numeroDocumento,
    clave: "12345",
    saldo: 100000,
    usuarios: [],
    estado: "ACTIVO",
    tasaVenta: 0
};
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
            tasaVenta
        }
        estado
        tasaVenta
    }
}`;
function revisarCamposEspecificos(error, res, done, campos) {
    if (error) return done(error);
    assert.graphQL(res.body);

    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('usuario');

    const { usuario } = res.body.data;
    expect(usuario).to.be.a("object");

    for (const prop in campos) {
        expect(usuario).to.have.property(prop);
        if (prop == 'clave') {
            expect(usuario[prop]).to.be.a("string");
            expect(usuario[prop]).to.have.lengthOf(60);
            continue;
        };
        if (prop == 'usuarios') {
            expect(usuario[prop]).to.be.a("array");
            expect(usuario[prop]).to.have.lengthOf(0);
            continue;
        };
        expect(usuario[prop]).to.equal(campos[prop]);
    };
    done();
}

const CREAR_USUARIO = `
mutation crearUsuario(
    $asesor: ID!
    $nombres: String!
    $apellidos: String!
    $tipoDocumento: String!
    $numeroDocumento: String!
    $clave: String!
    $saldo: Float!
    $capacidadPrestamo: Float!
    $tasaVenta: Float!
){
    usuario: crearUsuario(
        asesor: $asesor,
        nombres: $nombres,
        apellidos: $apellidos,
        tipoDocumento: $tipoDocumento,
        numeroDocumento: $numeroDocumento,
        clave: $clave,
        saldo: $saldo,
        capacidadPrestamo: $capacidadPrestamo,
        tasaVenta: $tasaVenta
        ){
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
            tasaVenta
            giros{
                id
            }
    }
}`;

const RECARGAR_USUARIO = `
    mutation RecargarUsuario(
        $numeroDocumento: String!,
        $valorRecarga: Float!
    ){
        usuario: recargarUsuario(
            numeroDocumento: $numeroDocumento,
            valorRecarga: $valorRecarga
            ){
            saldo
        }
    }
`;
const camposIngresadosRecargarUsuario = {
    numeroDocumento: numeroDocumento,
    valorRecarga: 25000
};
const camposEsperadosDeRecargarUsuario = {
    saldo: 150000
};
describe("POST: Recargar Usuario", () => {
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
    it("Crear un asesor como administrador", (done) => {
        request
            .post("/")
            .send({
                query: CREAR_ASESOR,
                variables: camposIngresadosCrearAsesor
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('asesor');
                const { asesor } = res.body.data;
                expect(asesor).to.be.a("object");
                expect(asesor.usuarios).to.have.lengthOf(0);
                idAsesor = asesor.id;
                done();
            });
    }, 30000);
    it("Crear un usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: CREAR_USUARIO,
                variables: {
                    asesor: idAsesor,
                    nombres: "Juansecito",
                    apellidos: "Rod",
                    tipoDocumento: "TI",
                    numeroDocumento: numeroDocumento,
                    clave: "12345",
                    saldo: 125000,
                    capacidadPrestamo: 100,
                    tasaVenta: 0.02
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
                expect(res.body.data).to.have.property('usuario');

                const { usuario } = res.body.data;
                expect(usuario).to.be.a("object");
                done();
            });
    }, 30000);
    it("Recargar el usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: RECARGAR_USUARIO,
                variables: camposIngresadosRecargarUsuario
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperadosDeRecargarUsuario));
    }, 30000);
    it("Obtener los asesores y corroborar el saldo del asesor", (done) => {
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
                    if (asesor.id == idAsesor) {
                        for (const prop in asesor) {
                            expect(asesor).to.have.property(prop);
                            if (prop == 'nombres') expect(asesor[prop]).to.be.a("string");
                            else if (prop == 'apellidos') expect(asesor[prop]).to.be.a("string");
                            else if (prop == 'tipoDocumento') expect(asesor[prop]).to.be.a("string");
                            else if (prop == 'numeroDocumento') expect(asesor[prop]).to.be.a("string");
                            else if (prop == 'clave') {
                                expect(asesor[prop]).to.be.a("string");
                                expect(asesor[prop]).to.have.lengthOf(60);
                            }
                            else if (prop == 'saldo') {
                                expect(asesor[prop]).to.be.a("number");
                                expect(asesor[prop]).to.equal(camposEsperadosCrearAsesor.saldo);
                            }
                            else if (prop == 'usuarios') expect(asesor[prop]).to.be.a("array");
                            else if (prop == 'estado') expect(asesor[prop]).to.be.a("string");
                            else if (prop == 'tasaVenta') expect(asesor[prop]).to.be.a("number");
                        }
                    }
                };
                done();
            });
    }, 30000);
});