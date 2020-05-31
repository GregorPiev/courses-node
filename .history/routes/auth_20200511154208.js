const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Sign In',
    isLogin: true,
    error: req.flash('error')
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);
      if (areSame) {
        // const user = await User.findById('5ea031542dc88029f49d1e76');
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save(err => {
          if (err) {
            throw (err);
          }
          res.redirect('/');
        });
      } else {
        console.warn('Login failed. Not valid password');
        req.flash('error', 'Login failed. Not valid email');
        res.redirect('/auth/login#login');
      }
    } else {
      console.warn('Login failed. Not valid email');
      req.flash('error', 'Login failed. Not valid email');
      res.redirect('/auth/login#login');
    }

  } catch (err) {
    console.error('Login error:', err);
    req.flash(err);
    res.redirect('/auth/login#login');
  }



});

router.get('/logout', async (req, res) => {
  req.user = null;
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
})

router.post('/register', async (req, res) => {
  try {
    const { email, password, repeat, name } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash('error', 'User with that email exist yet');
      res.redirect('/auth/login#reqister');
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email, name, password: hashPassword, cart: { items: [] }
      });
      user.save();
      res.redirect('/auth/login#login');
    }
  } catch (err) {
    console.error('Register error:', err);
  }
});


module.exports = router;