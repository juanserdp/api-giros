import chai from "chai";
import chaiGraphQL from 'chai-graphql';
import { iniciarSesionComoAdmin, iniciarSesionComoAsesor } from "../../../../constants/login";
import { v4 as uuidv4 } from 'uuid';
import { usuarioCamposGql } from "../../../../constants/camposGraphql";
chai.use(chaiGraphQL);
const supertest = require("supertest");
var atob = require('atob');
const { assert } = chai;
const baseURL = "http://localhost:4000/graphql";
const request = supertest(baseURL);
const expect = chai.expect;
let tokenAsesor = "";
let idAsesor = "";
let idUsuario = "";

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
        if (prop == 'giros') continue;
        expect(usuario[prop]).to.equal(campos[prop]);
    };
    done();
}

const numeroDocumento = uuidv4();

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
){
    usuario: crearUsuario(
        asesor: $asesor,
        nombres: $nombres,
        apellidos: $apellidos,
        tipoDocumento: $tipoDocumento,
        numeroDocumento: $numeroDocumento,
        clave: $clave,
        saldo: $saldo,
        capacidadPrestamo: $capacidadPrestamo
        ){
            ${usuarioCamposGql}
    }
}`;

const EDITAR_USUARIO = `
    mutation editarUsuario(
        $id: ID!
        $usuario: UsuarioForUpdateInput!
    ){
        usuario: editarUsuario(
            id: $id,
            usuario: $usuario
            ){
                ${usuarioCamposGql}
        }
    }
`;

const datosCrearUsuario = {
    asesor: idAsesor,
    nombres: "Juansecito",
    apellidos: "Rod",
    tipoDocumento: "TI",
    numeroDocumento: numeroDocumento,
    clave: "Juancesito12345",
    saldo: 10000000,
    capacidadPrestamo: 100
};

const datosEditarUsuario = {
    nombres: "Juansecito2",
    apellidos: "Rod2",
    tipoDocumento: "TI2",
    numeroDocumento: numeroDocumento + "012345",
    clave: "Juancesito123456789",
    saldo: 1000,
    deuda: 1000,
    capacidadPrestamo: 1000,
    estado: "INACTIVO",
    tasaPreferencial: 2,
    usarTasaPreferencial: true,
};

const camposEsperados = {
    nombres: "Juansecito2",
    apellidos: "Rod2",
    tipoDocumento: "TI2",
    numeroDocumento: numeroDocumento + "012345",
    clave: "Juancesito123456789",
    saldo: 1000,
    deuda: 1000,
    capacidadPrestamo: 1000,
    estado: "INACTIVO",
    tasaPreferencial: 2,
    usarTasaPreferencial: true,
    giros: []
};

const datosEditarDatosPersonalesUsuario = {
    nombres: "Sebitas",
    apellidos: "xxxx",
    tipoDocumento: "xxxx",
    numeroDocumento: numeroDocumento + "1231514786"
};

const datosEditarClaveUsuario = {
    clave: "ClaveEditada123"
};

describe("POST: Editar Usuario", () => {
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

    it("Crear un usuario como asesor", (done) => {
        request
            .post("/")
            .send({
                query: CREAR_USUARIO,
                variables: { ...datosCrearUsuario, asesor: idAsesor }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(200)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQL(res.body);

                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('usuario');

                const { usuario } = res.body.data;
                expect(usuario).to.be.a("object");
                idUsuario = usuario.id;
                done();
            });
    });

    it("Editar el usuario como asesor", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO,
                variables: {
                    id: idUsuario,
                    usuario: datosEditarUsuario
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, camposEsperados));
    });

    it("Obtener un error si el numero de documento se repite", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO,
                variables: {
                    id: idUsuario,
                    usuario: datosEditarUsuario
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(500)
            .end((error, res) => {
                if (error) return done(error);
                assert.graphQLError(res.body);
                expect(res.body).to.have.property('errors');

                expect(res.body.errors).to.be.a("array");
                expect(res.body.errors).to.have.lengthOf(1);

                const { message } = res.body.errors[0];
                expect(message).to.be.a("string");
                expect(message).to.equal("Error: Ya existe un usuario con ese numero de documento!");
                done();
            });
    })

    it("Editar los datos personales del usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO,
                variables: {
                    id: idUsuario,
                    usuario: datosEditarDatosPersonalesUsuario
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, datosEditarDatosPersonalesUsuario));
    });

    it("Editar la contraseña del usuario como administrador", (done) => {
        request
            .post("/")
            .send({
                query: EDITAR_USUARIO,
                variables: {
                    id: idUsuario,
                    usuario: datosEditarClaveUsuario
                }
            })
            .set("Accept", "application/json")
            .set("Content-type", "application/json")
            .auth(tokenAsesor, { type: 'bearer' })
            .expect(200)
            .end((error, res) => revisarCamposEspecificos(error, res, done, datosEditarClaveUsuario));
    });
});