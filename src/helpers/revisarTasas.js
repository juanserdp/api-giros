
export function revisarTasas(tasaAdmin, tasaAsesor, tasaUsuario, result){
    if(tasaAdmin >= tasaAsesor){
        return result({error:"La tasa de venta del Administrador es mayor o igual a la del Asesor, porfavor pida al Asesor que aumente su tasa de venta"});
    }
    if(tasaAdmin >= tasaUsuario){
        return result({error:"La tasa de venta del Administrador es mayor o igual a la del Usuario, porfavor aumente su tasa de venta"});
    }
    if(tasaAsesor >= tasaUsuario){
        return result({error:"La tasa de venta del Asesor es mayor o igual a la del Usuario, porfavor aumente su tasa de venta"});
    }
}