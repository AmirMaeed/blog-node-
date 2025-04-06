const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Read token from cookies

    if (!token) {
        return res.redirect("/login"); // Redirect if token is missing
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store user data in req
        next();
    } catch (err) {
        return res.redirect("/login"); // Redirect if invalid token
    }
};

module.exports = verifyToken;
