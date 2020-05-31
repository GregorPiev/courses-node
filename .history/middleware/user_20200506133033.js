const User = require('../models/user');

module.exports = async function(req, res, next) {
  if(!req.session.user) {
      return next('route');
  }

  console.log('User _id:', req.session.user._id);
  req.user = await User.findById(req.session.user._id);
  console.info('Middleware user:', req.user);
  next('route');
};