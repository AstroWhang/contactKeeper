// middleware is a function that has access to the request and response object
// fired off whenever we hit an endpoint and check to see if token is in header
const jwt = require('jsonwebtoken');
const config = require('config');

// whenever you use middleware need next, which means move onto the next middleware (if exists)
module.exports = function(req, res, next) {
  // get token from header
  const token = req.header('x-auth-token');

  // check if token exists
  if(!token) {
    return res.status(401).json({ msg: 'No token, authorization denied'});
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid'});
  }
}