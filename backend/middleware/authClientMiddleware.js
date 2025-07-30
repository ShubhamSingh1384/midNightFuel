const jwt = require('jsonwebtoken');

const authClientMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized user! Token not provided',
      });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const { userId } = decoded;
      req.userId = userId;
      next();
    } catch (error) {
      console.error("Error is:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = { authClientMiddleware };
