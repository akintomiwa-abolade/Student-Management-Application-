const jwt = require('jsonwebtoken');
require('dotenv').config();

var secret = process.env.SECRET;

module.exports = function(req, res, next) {
  let token = req.headers["authorization"];

  if (token) {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.json({
          success: false,
          message: 'Failed to authenticate token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      error: true,
      message: 'No token provided'
    });
  }
}
