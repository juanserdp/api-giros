export default class Recargar {
    constructor(saldo, deuda=0, capacidadPrestamo=0, valorRecarga) {
        this.saldo = saldo; /// 100
        this.deuda = deuda; // 20
        this.capacidadPrestamo = capacidadPrestamo; //200
        this.tope = this.saldo + this.capacidadPrestamo; // TOPE MAXIMO BRUTO //  300
        this.topeMaximoNeto = this.tope - this.deuda; // TOPE MAXIMO NETO(DESCONTANDO DEUDAS) // 280
    }
    puedeHacerLaRecarga(valorRecarga, callback) {
        const valorABSDifSaldoGiro = Math.abs(this.saldo - valorRecarga); // |100 - 150| = 50
        const dineroMaximoProximoPrestamo = this.topeMaximoNeto - valorRecarga; // 280 - 150 = 130
        if (dineroMaximoProximoPrestamo >= 0) return callback(null, valorABSDifSaldoGiro);
        else return callback(true, null);
    }
    hacerRecarga(valorRecarga) {
        return this.puedeHacerLaRecarga(valorRecarga, (error, data) => {
            if (data) {
                if (valorRecarga < 1)
                    return { error: "El monto minimo de envio es 1!", data: null };
                else if (this.saldo < valorRecarga) {
                    this.saldo = 0;
                    this.deuda += data;
                }
                else this.saldo = data;
                return { error: null, data: "Giro realizado con exito" }
            }
            else if (error) return { error: "Saldo insuficiente!", data: null };
        })
    }
    obtenerCuentas() {
        return {
            saldo: this.saldo,
            deuda: this.deuda,
            capacidadPrestamo: this.capacidadPrestamo
        }
    }
}