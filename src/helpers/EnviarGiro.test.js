import EnviarGiro from "./EnviarGiro";

describe("Al enviar un giro", () => {
    it("Envía el giro cuando el saldo es superior al giro", () => {
        const valorGiro = 200000;
        const usuarioAntes1 = {
            saldo: 250000,
            deuda: 0,
            capacidadPrestamo: 100
        };
        const usuarioDespues1 = {
            saldo: 50000,
            deuda: 0,
            capacidadPrestamo: 100
        };
        const giro = new EnviarGiro(usuarioAntes1.saldo, usuarioAntes1.deuda, usuarioAntes1.capacidadPrestamo);
        //console.log("CUENTAS ANTES: ", giro.obtenerCuentas());

        const { error, data } = giro.hacerGiro(valorGiro);

        if (error) console.log(error);
        if (data) {
            expect(giro.obtenerCuentas()).toEqual(usuarioDespues1);
        }

        //console.log("VAlOR GIRO:", valorGiro);
        //console.log("CUENTAS DESPUES: ", giro.obtenerCuentas());

    });
    it("Envia el giro cuando el saldo mas la capacidad de prestamo es superior al giro y sube la deuda del usuario.", () => {
        const valorGiro = 200000;
        const usuarioAntes2 = {
            saldo: 150000,
            deuda: 0,
            capacidadPrestamo: 100000
        };
        const usuarioDespues2 = {
            saldo: 0,
            deuda: 50000,
            capacidadPrestamo: 100000
        };
        const giro = new EnviarGiro(usuarioAntes2.saldo, usuarioAntes2.deuda, usuarioAntes2.capacidadPrestamo);
        //console.log("CUENTAS ANTES**: ", giro.obtenerCuentas());
        //console.log("VAlOR GIRO**:", valorGiro);
        const { error, data } = giro.hacerGiro(valorGiro);

        //if (error) console.log("RTA**", error);
        if (data) {
            expect(giro.obtenerCuentas()).toEqual(usuarioDespues2);
            //console.log("********")
        }

        
        //console.log("CUENTAS DESPUES**: ", giro.obtenerCuentas());

    });
    it("Envia el giro cuando el saldo mas la capacidad de prestamo es superior al giro y sube la deuda del usuario.", () => {
        const valorGiro = 150000;
        const usuarioAntes2 = {
            saldo: 100000,
            deuda: 20000,
            capacidadPrestamo: 200000
        };
        const usuarioDespues2 = {
            saldo: 0,
            deuda: 70000,
            capacidadPrestamo: 200000
        };
        const giro = new EnviarGiro(usuarioAntes2.saldo, usuarioAntes2.deuda, usuarioAntes2.capacidadPrestamo);
        //console.log("CUENTAS ANTES**: ", giro.obtenerCuentas());
        //console.log("VAlOR GIRO**:", valorGiro);
        const { error, data } = giro.hacerGiro(valorGiro);

        //if (error) console.log("RTA**", error);
        if (data) {
            expect(giro.obtenerCuentas()).toEqual(usuarioDespues2);
            //console.log("********")
        }

        
        //console.log("CUENTAS DESPUES**: ", giro.obtenerCuentas());

    });
    it("Envia el giro cuando el saldo mas la capacidad de prestamo es superior al giro mas la deuda y sube la deuda del usuario.", () => {
        const valorGiro = 200000;
        const usuarioAntes2 = {
            saldo: 150000,
            deuda: 40000,
            capacidadPrestamo: 100000
        };
        const usuarioDespues2 = {
            saldo: 0,
            deuda: 90000,
            capacidadPrestamo: 100000
        };
        const giro = new EnviarGiro(usuarioAntes2.saldo, usuarioAntes2.deuda, usuarioAntes2.capacidadPrestamo);
        //console.log("CUENTAS ANTES*: ", giro.obtenerCuentas());
        //console.log("VAlOR GIRO*:", valorGiro);
        const { error, data } = giro.hacerGiro(valorGiro);
        //console.log("CUENTAS DESPUES*: ", giro.obtenerCuentas());

        if (error) console.log("RTA*", error);
        if (data) {
            expect(giro.obtenerCuentas()).toEqual(usuarioDespues2);
            //console.log("********")
        }
    });
    it("Lanza una advertencia cuando el valor del giro es superior al saldo y a la capacidad de prestamo", () => {
        const valorGiro = 500000;
        const usuarioAntes = {
            saldo: 300500,
            deuda: 0,
            capacidadPrestamo: 150000
        };
        const usuarioDespues = {
            saldo: 300500,
            deuda: 0,
            capacidadPrestamo: 150000
        };
        const giro = new EnviarGiro(usuarioAntes.saldo, usuarioAntes.deuda, usuarioAntes.capacidadPrestamo);
        //console.log("CUENTAS ANTES: ", giro.obtenerCuentas());

        const { error, data } = giro.hacerGiro(valorGiro);

        //if (error) console.log(error);
        if (data) {
            expect(giro.obtenerCuentas()).toEqual(usuarioDespues);
        }
        //console.log("VAlOR GIRO:", valorGiro);

    });


    it("Lanza una advertencia cuando el valor del giro es cero", () => {
        const valorGiro = 0;
        const usuarioAntes = {
            saldo: 999500,
            deuda: 0,
            capacidadPrestamo: 150000
        };
        const usuarioDespues = {
            saldo: 999500,
            deuda: 0,
            capacidadPrestamo: 150000
        };
        const giro = new EnviarGiro(usuarioAntes.saldo, usuarioAntes.deuda, usuarioAntes.capacidadPrestamo);
        //console.log("CUENTAS ANTES: ", giro.obtenerCuentas());

        const { error, data } = giro.hacerGiro(valorGiro);

        //if (error) console.log(error);
        if (data) {
            expect(giro.obtenerCuentas()).toEqual(usuarioDespues);
        }
        //console.log("VAlOR GIRO:", valorGiro);
    });
})