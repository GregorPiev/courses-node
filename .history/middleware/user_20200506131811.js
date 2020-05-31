const User = require('../models/user');

module.exports = async function(req, res, next) {
  if(!req.session.user) {
      return next();
  }

  console.log('Iser _id:', req.session.user._id);
  req.user = await User.findById(req.session.user._id);
  next();
};