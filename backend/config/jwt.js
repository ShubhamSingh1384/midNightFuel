const jwt = require('jsonwebtoken');

function createToken(payload) {
    // console.log("Payload: ", payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    return token;
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log("Decoded token: ", decoded); // Log decoded token to verify expiration
        return decoded;
    } catch (error) {
        console.log("Token verification error: ", error.message);
        return null; // If token is expired, return null
    }
}

module.exports = { createToken, verifyToken };
