const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

const jwtSecret = config.get('jwtSecret');

//  Check for jwtSecret and x-auth-token
module.exports = function(req, res, next) {
  if (!config.has('jwtSecret')) {
    return res.status(500).json({ message: 'Configuration property "jwtSecret" is not defined.' });
  }

  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Missing auth token, authorization denied.' });
  }

  try {
    const decodedData = jwt.verify(token, jwtSecret);
    req.user = decodedData.user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'Invalid auth token.' });
  }
};

//  Check for Authorization header and verify token
module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
      return res.status(401).json({ message: 'Missing auth token, authorization denied.' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
      return res.status(401).json({ message: 'Missing auth token, authorization denied.' });
  }

  try {
      const decodedData = jwt.verify(token, jwtSecret);
      req.user = await User.findById(decodedData.user.id).select('-password');
      next();
  } catch (err) {
      console.error(err.message);
      res.status(401).json({ message: 'Invalid auth token.' });
  }
};