const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

const jwtSecret = config.get('jwtSecret');

//  Check for jwtSecret and x-auth-token
module.exports = function(req, res, next) {
  if (!config.has('jwtSecret')) {
    return res.status(500).json({ msg: 'Configuration property "jwtSecret" is not defined' });
  }

  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'Missing auth token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

//  Check for Authorization header and verify token
module.exports = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
      return res.status(401).json({ msg: 'Missing auth token, authorization denied' });
  }

  try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = await User.findById(decoded.user.id).select('-password');
      next();
  } catch (err) {
      console.error(err.message);
      res.status(401).json({ msg: 'Invalid token' });
  }
};