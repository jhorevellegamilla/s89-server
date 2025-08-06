require('dotenv').config();
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


//[SECTION] Token Creation

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    return jwt.sign(data, JWT_SECRET_KEY, {});
}

// Token Verification
module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return res.status(401).json({ auth: "Failed", message: "No Token" });
    } else {
        token = token.slice(7);
        jwt.verify(token, JWT_SECRET_KEY, function(err, decodedToken){
            if (err) {
                return res.status(403).json({
                    auth: "Failed",
                    message: err.message
                });
            } else {
                req.user = decodedToken;
                next();
            }
        });
    }
};

// Admin
module.exports.verifyAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).send({
            auth: "Failed",
            message: "Admin access only"
        });
    }
    next();
};


// Error Handler
module.exports.errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
}