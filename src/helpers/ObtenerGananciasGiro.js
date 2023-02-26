export default class ObtenerGananciasGiro {
    constructor(usuario, asesor, admin, valorGiro) {
        this.admin = admin;
        this.asesor = asesor;
        this.usuario = usuario;
        this.valorGiro = valorGiro;// 5000

        this.valorGiroBolivares = valorGiro / this.usuario.tasaVenta; // 5000 / 23 = 217,3913

        this.valorGiroNetoUsuario = this.valorGiroBolivares * (this.usuario.usarTasaPreferencial ? this.usuario.tasaPreferencial : this.asesor.tasaVenta); // 870
        this.valorGiroNetoAsesor = this.valorGiroBolivares * (this.asesor.usarTasaPreferencial ? this.asesor.tasaPreferencial : this.admin.tasaVenta);
        this.valorGiroNetoAdmin = this.valorGiroBolivares * this.admin.tasaPreferencial;
    }
    obtenerCuentas() {
        const ganancias = {
            usuario: Number((this.valorGiro - this.valorGiroNetoUsuario).toFixed(2)), //5000 - 870 = 4130
            asesor: Number((this.valorGiroNetoUsuario - this.valorGiroNetoAsesor).toFixed(2)),
            admin: Number((this.valorGiroNetoAsesor - this.valorGiroNetoAdmin).toFixed(2))
        };
        console.log(ganancias);
        return ganancias;
    }
} 