import jwt from "jsonwebtoken";

export const validarJwt = (req, res, next) => {
    let token = "";
    token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) {
        req.user = { autorizacion: false };
        next();
        return;
    }
    else if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }
    try {
        const { uid, estado, rol } = jwt.verify(token, process.env.JWT_SECRET);
        console.log("uid(from token): ", uid, "(validarJwt.js)");
        console.log("estado(from token): ", estado, "(validarJwt.js)");
        console.log("rol(from token): ", rol, "(validarJwt.js)");
        req.user = { autorizacion: true, uid, estado, rol };
    } catch (error) {
        console.error(error, " (validarJwt.js)");
        req.user = { autorizacion: false };
    }
    next();
    return;
}