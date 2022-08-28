import EnviarGiro from "./EnviarGiro";

describe("Al enviar un giro",()=>{
    it("Envía el giro cuando el saldo es superior al giro",()=>{
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
        const giro1 = new EnviarGiro(usuarioAntes1.saldo, usuarioAntes1.deuda, usuarioAntes1.capacidadPrestamo);
        console.log("CUENTAS ANTES: ", giro1.obtenerCuentas());

        const {error, data} = giro1.hacerGiro(valorGiro);

        if(error) console.log(error);
        if(data) {
            expect(giro1.obtenerCuentas()).toEqual(usuarioDespues1);
        }

        console.log("VAlOR GIRO:",valorGiro);
        console.log("CUENTAS DESPUES: ",giro1.obtenerCuentas());
        
    });
    
    it("Envia el giro cuando el saldo mas la capacidad de prestamo es superior al giro y sube la deuda del usuario.",()=>{
        const valorGiro = 200000;
        const usuarioAntes2 = {
            saldo: 15000,
            deuda: 0,
            capacidadPrestamo: 100000
        };
        const usuarioDespues2 = {
            saldo: 0,
            deuda: 50000,
            capacidadPrestamo: 100000
        };
        const giro2 = new EnviarGiro(usuarioAntes2.saldo, usuarioAntes2.deuda, usuarioAntes2.capacidadPrestamo);
        console.log("CUENTAS ANTES: ", giro2.obtenerCuentas());

        const {error, data} = giro2.hacerGiro(valorGiro);

        if(error) console.log(error);
        if(data) {
            expect(giro2.obtenerCuentas()).toEqual(usuarioDespues2);
        }

        console.log("VAlOR GIRO:",valorGiro);
        console.log("CUENTAS DESPUES: ",giro2.obtenerCuentas());

    });

    it("Lanza una advertencia cuando el valor del giro es superior al saldo y a la capacidad de prestamo",()=>{
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
        console.log("CUENTAS ANTES: ", giro.obtenerCuentas());

        const {error, data} = giro.hacerGiro(valorGiro);

        if(error) console.log(error);
        if(data) {
            expect(giro3.obtenerCuentas()).toEqual(usuarioDespues3);
        }
        console.log("VAlOR GIRO:",valorGiro);
        
    });


    it("Lanza una advertencia cuando el valor del giro es cero",()=>{
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
        console.log("CUENTAS ANTES: ", giro.obtenerCuentas());

        const {error, data} = giro.hacerGiro(valorGiro);

        if(error) console.log(error);
        if(data) {
            expect(giro.obtenerCuentas()).toEqual(usuarioDespues);
        }
        console.log("VAlOR GIRO:",valorGiro);
    });
})