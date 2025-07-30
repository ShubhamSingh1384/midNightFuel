const jwt = require('jsonwebtoken');

const authentication = async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized user! Token not provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    console.log("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized user! Invalid token',
    });
  }
};

module.exports = { authentication };
