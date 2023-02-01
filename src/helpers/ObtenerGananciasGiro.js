export default class ObtenerGananciasGiro {
    constructor(usuario, asesor, admin, valorGiro) {
        this.admin = admin;
        this.asesor = asesor;
        this.usuario = usuario;
        this.valorGiro = valorGiro;

        this.valorGiroBolivares = valorGiro / usuario.tasaVenta;

        this.valorGiroNetoUsuario = this.valorGiroBolivares * this.asesor.tasaVenta;
        this.valorGiroNetoAsesor = this.valorGiroBolivares * this.admin.tasaVenta;
        this.valorGiroNetoAdmin = this.valorGiroBolivares * this.admin.tasaPreferencial;
    }

    obtenerCuentas() {
        const ganancias = {
            usuario: (this.valorGiro - this.valorGiroNetoUsuario).toFixed(2),
            asesor: (this.valorGiroNetoUsuario - this.valorGiroNetoAsesor).toFixed(2),
            admin: (this.valorGiroNetoAsesor - this.valorGiroNetoAdmin).toFixed(2)
        };
        console.log(ganancias);
        return ganancias;
    }
} 