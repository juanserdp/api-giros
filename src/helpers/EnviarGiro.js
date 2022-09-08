export default class EnviarGiro {
    constructor(saldo, deuda, capacidadPrestamo) {
        this.saldo = saldo; /// 100
        this.deuda = deuda; // 20
        this.capacidadPrestamo = capacidadPrestamo; //200
        this.tope = this.saldo + this.capacidadPrestamo; // TOPE MAXIMO BRUTO //  300
        this.topeMaximoNeto = this.tope - this.deuda; // TOPE MAXIMO NETO(DESCONTANDO DEUDAS) // 280
    }
    puedeHacerElGiro(valorGiro, callback) {
        const valorABSDifSaldoGiro = Math.abs(this.saldo - valorGiro); // |100 - 150| = 50
        const dineroMaximoProximoPrestamo = this.topeMaximoNeto - valorGiro; // 280 - 150 = 130
        if (dineroMaximoProximoPrestamo >= 0) return callback(null, valorABSDifSaldoGiro);
        else return callback(true, null);
    }
    hacerGiro(valorGiro) {
        return this.puedeHacerElGiro(valorGiro, (error, data) => {
            if (data) {
                if (valorGiro <= 0)
                    return { error: "El monto minimo de envio es 0!", data: null };
                else if (this.saldo < valorGiro) {
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