import { expect } from "chai"
import { seguridad, validarClave } from "./validarClave"


describe("Validar Clave", ()=>{
    it("Si la contraseña tiene menos de 8 caracteres muestra un error y cuenta con Mayus y numeros",()=>{
        validarClave("Hola123", (errores, clave)=>{
            expect(clave).equal(null);
            if(errores){
                for(let error of errores){
                    expect(error).to.equal(`La clave debe contener al menos ${seguridad.longitud} caracteres`)
                }
            }
        })
    })

    it("Si la contraseña tiene 8 caracteres muestra un error y NO cuenta con Mayus y numeros",()=>{
        validarClave("hoola123", (errores, clave)=>{
            expect(clave).equal(null);
            if(errores){
                for(let error of errores){
                    expect(error).to.equal(`La clave debe contener al menos ${seguridad.cantidadMayusculas} mayuscula`)
                }
            }
        })
    })

    it("Si la contraseña tiene 8 caracteres muestra un error y cuenta con Mayus y NO cuenta con numeros",()=>{
        validarClave("Hoolaaaa", (errores, clave)=>{
            expect(clave).equal(null);
            if(errores){
                for(let error of errores){
                    expect(error).to.equal(`La clave debe contener al menos ${seguridad.cantidadNumeros} numero`)
                }
            }
        })
    })

    it("Si la contraseña tiene 8 caracteres muestra un error y cuenta con Mayus y cuenta con numeros",()=>{
        validarClave("Hoolaaaa1234", (errores, clave)=>{
            expect(clave).not.equal(null);
            expect(errores).equal(null);
        })
    })
})