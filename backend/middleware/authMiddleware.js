const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization"); // Obtener el header correcto

    if (!authHeader) {
        return res.status(401).json({ message: "Acceso denegado, token requerido" });
    }

    const token = authHeader.split(" ")[1]; // Extraer el token sin "Bearer"

    if (!token) {
        return res.status(400).json({ message: "Token inválido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Token inválido" });
    }
};
