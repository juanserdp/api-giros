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
let idUsuario = "";
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
const numeroDocumento = uuidv4();
const camposIngresados = {
    asesor: "6324e92712898dffd630af61",
    nombres: "Juansecito",
    apellidos: "Rod",
    tipoDocumento: "TI",
    numeroDocumento: numeroDocumento,
    clave: "12345",
    saldo: 1700000,
    capacidadPrestamo: 500000,
    tasaVenta: 0.02
};

const CREAR_GIRO = `
mutation CrearGiro(
    $usuario: ID!,
    $nombres: String!,
    $apellidos: String!,
    $tipoDocumento: String!,
    $numeroDocumento: String!,
    $banco:String!,
    $tipoCuenta: String!,
    $numeroCuenta: String!,
    $valorGiro: Float!,
    $tasaCompra: Float!
){
    giro: crearGiro(
        usuario: $usuario,
        nombres: $nombres,
        apellidos:$apellidos,
        tipoDocumento:$tipoDocumento,
        numeroDocumento:$numeroDocumento,
        banco:$banco,
        tipoCuenta:$tipoCuenta,
        numeroCuenta:$numeroCuenta,
        valorGiro:$valorGiro,
        tasaCompra:$tasaCompra,
        ){
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
                comprobantePago,
                fechaEnvio,
                tasaCompra,
                estadoGiro
        }
}
`;

const camposEsperadosCrearGiro = {
    nombres: "Juansecito",
    apellidos: "Rod",
    tipoDocumento: "TI",
    numeroDocumento: numeroDocumento,
    banco: "bbva2",
    tipoCuenta: "ahorros",
    numeroCuenta: "2381932",
    valorGiro: 2000000,
    comprobantePago: null,
    tasaCompra: 0.12,
    estadoGiro: "PENDIENTE"
};
const camposEsperadosUsuarioDespuesEnviarGiro = {
    nombres: "Juansecito",
    apellidos: "Rod",
    tipoDocumento: "TI",
    numeroDocumento: numeroDocumento,
    clave: "12345",
    saldo: 0,
    deuda: 300000,
    capacidadPrestamo: 500000,
    estado: "ACTIVO",
    tasaVenta: 0.02,
    giros: [{
        nombres: "Juansecito",
        apellidos: "Rod",
        tipoDocumento: "TI",
        numeroDocumento: numeroDocumento,
        banco: "bbva2",
        tipoCuenta: "ahorros",
        numeroCuenta: "2381932",
        valorGiro: 2000000,
        comprobantePago: null,
        tasaCompra: 0.12,
        estadoGiro: "PENDIENTE"
    }]
};
const OBTENER_USUARIOS = `
query {
    usuarios: obtenerUsuarios{
        id
        asesor{
            id
        }
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
            nombres,
            apellidos,
            tipoDocumento,
            numeroDocumento,
            banco,
            tipoCuenta,
            numeroCuenta,
            valorGiro,
            comprobantePago,
            tasaCompra,
            estadoGiro
        }
    }
}
`;
describe("POST: Crear Giro", () => {
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

    it("Crear un usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: CREAR_USUARIO,
                variables: camposIngresados
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAdmin, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);
                const { usuario } = res.body.data;
                idUsuario = usuario.id;
                done();
            });
    }, 30000);
  
    it("Enviar giro como administrador", (done) => {
        request
            .post("/")
            .send({
                query: CREAR_GIRO,
                variables: {
                    usuario: idUsuario,
                    nombres: "Juansecito",
                    apellidos: "Rod",
                    tipoDocumento: "TI",
                    numeroDocumento: numeroDocumento,
                    banco: "bbva2",
                    tipoCuenta: "ahorros",
                    numeroCuenta: "2381932",
                    valorGiro: 2000000,
                    comprobantePago: null,
                    tasaCompra: 0.12
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
                expect(res.body.data).to.have.property('giro');

                const { giro } = res.body.data;
                expect(giro).to.be.a("object");

                for (const prop in camposEsperadosCrearGiro) {
                    expect(giro).to.have.property(prop);
                    expect(giro[prop]).to.equal(camposEsperadosCrearGiro[prop]);
                };
                done();
            });
    }, 30000);

    it("Obtener el usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: OBTENER_USUARIOS
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

                    if (usuario.numeroDocumento == numeroDocumento) {
                        for (const prop in camposEsperadosUsuarioDespuesEnviarGiro) {
                            expect(usuario).to.have.property(prop);

                            if (prop == 'nombres' || prop == 'apellidos' ||
                                prop == 'tipoDocumento' || prop == 'numeroDocumento' ||
                                prop == 'estado') {
                                expect(usuario[prop]).to.be.a("string");
                                expect(usuario[prop]).to.equal(camposEsperadosUsuarioDespuesEnviarGiro[prop]);
                            }
                            else if (prop == 'clave') {
                                expect(usuario[prop]).to.be.a("string");
                                expect(usuario[prop]).to.have.lengthOf(60);
                            }
                            else if (prop == 'saldo' || prop == 'tasaVenta' ||
                                prop == 'deuda' || prop == 'capacidadPrestamo') {
                                expect(usuario[prop]).to.be.a("number");
                                expect(usuario[prop]).to.equal(camposEsperadosUsuarioDespuesEnviarGiro[prop]);
                            }
                            else if (prop == 'giros') {
                                expect(usuario[prop]).to.be.a("array");
                                for (const giro of usuario.giros) {
                                    for (const prop in camposEsperadosUsuarioDespuesEnviarGiro.giros[0]) {
                                        expect(giro).to.have.property(prop);
                                        expect(giro[prop]).to.equal(camposEsperadosUsuarioDespuesEnviarGiro.giros[0][prop]);
                                    }
                                }
                            }
                        };
                    }
                };
                done();
            });
    }, 30000);

});