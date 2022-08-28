export default class EnviarGiro {
    constructor(saldo, deuda, capacidadPrestamo) {
        this.saldo = saldo;
        this.deuda = deuda;
        this.capacidadPrestamo = capacidadPrestamo;
    }
    puedeHacerElGiro(valorGiro, callback) {
        const tope = this.saldo + this.capacidadPrestamo;
        const topeMaximoNeto = tope - this.deuda;
        if (topeMaximoNeto - valorGiro >= 0)
            return callback(null, true);
        else return callback(null, false);
    }
    hacerGiro(valorGiro) {
        return this.puedeHacerElGiro(valorGiro, (error, data) => {
            if (data) {
                if(valorGiro <= 0) 
                    return {error: "El monto minimo de envio es 0!", data: null};
                if (this.saldo < valorGiro) {
                    this.saldo = 0;
                    const desfalco = valorGiro - this.saldo;
                    this.deuda = this.deuda + desfalco;
                }
                else {
                    this.saldo = this.saldo - valorGiro;
                }
                return {error: null, data: "Giro realizado con exito"}
            }
            else return {error: "Saldo insuficiente!", data: null};
        })
    }
    obtenerCuentas() {
        return this;
    }
}