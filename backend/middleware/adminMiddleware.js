const jwt = require('jsonwebtoken');

const adminAuthenticate = async (req, res, next) => {
    const { admintoken } = req.headers;

    if (!admintoken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user!"
        });
    }

    try {
        const decoded = jwt.verify(admintoken.trim(), process.env.ADMIN_JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Error in admin authentication:", error);
        res.status(401).json({
            success: false,
            message: "Unauthorized user!"
        });
    }
};

module.exports = { adminAuthenticate };
