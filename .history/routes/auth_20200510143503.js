const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Sign In',
    isLogin: true
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = +candidate.password === +password;
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
        res.redirect('/auth/login#login');
      }
    } else {
      console.warn('Login failed. Not valid email');
      res.redirect('/auth/login#login');
    }

  } catch (err) {
    console.error('Login error:', err);
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
      res.redirect('/auth/login#reqister');
    } else {
      const user = new User({
        email, name, password, cart: { items: [] }
      });
      user.save();
      res.redirect('/auth/login#login');
    }
  } catch (err) {
    console.error('Trgister error:', err);
  }
});


module.exports = router;