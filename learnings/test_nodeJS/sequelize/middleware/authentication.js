const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = (req,res,next) => {
  try {
    const token  = req.headers["x-access-token"];
    if (!token) {
      throw new Error('Not authenticated');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({
      name: error.name,
        message: error.message,
        data: error.data,
    });
  }
};

