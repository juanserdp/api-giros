import jwt from "jsonwebtoken";

export const generarJwt = (uid, estado, rol) => {
    return new Promise((resolve, reject)=>{
        const payload = {
            uid, 
            estado,
            rol
        };
        jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:"6h"},(error, token)=>{
            if(error) reject("Error generando token");
            else resolve(token);
        });
    });
}