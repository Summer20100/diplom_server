const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            return next();
        };
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(403).json({ message: "Пользователь не авторизован" });
            };
            const token = authHeader.split(" ")[1];

            const { roles: userRoles } = jwt.verify(token, secret);
            let hasRole = false;

            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                };
            });
            if (!hasRole) {
                return res.status(403).json({ message: "У вас нет доступа" });
            };

            next();
        } catch (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(403).json({ message: "Пользователь не авторизован" });
        }
    }
}
