const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const router = Router();
const keys = require('../keys/');
const regEmail = require('../emails/registrations');
const resetEmail = require('../emails/reset');


const transporter = nodemailer.createTransport(sendgrid({
  auth: { api_key: keys.SENDGRID_API_KEY }
}));


router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Sign In',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
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
        req.flash('loginError', 'Login failed. Not valid email');
        res.redirect('/auth/login#login');
      }
    } else {
      console.warn('Login failed. Not valid email');
      req.flash('loginError', 'Login failed. Not valid email');
      res.redirect('/auth/login#login');
    }

  } catch (err) {
    console.error('Login error:', err);
    req.flash('loginError', err);
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
      req.flash('registerError', 'User with that email exist yet');
      res.redirect('/auth/login#reqister');
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email, name, password: hashPassword, cart: { items: [] }
      });
      user.save();
      res.redirect('/auth/login#login');
      await transporter.sendMail(regEmail(email));
    }
  } catch (err) {
    req.flash('registerError', err)
    console.error('Register error:', err);
  }
});

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Forget password?',
    error: req.flash('error')
  });
});

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login');
  }

  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExp: { $gt: Date.now() }
  })
  res.render('auth/password', {
    title: 'New password?',
    error: req.flash('error')
  });
});

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', `Unknown error: ${err}`)
        return res.redirect('/auth/reset');
      }

      const token = buffer.toString('hex');
      const candidate = await User.findOne({ email: req.body.email });
      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await transporter.sendMail(resetEmail(candidate.email, token));
        res.redirect('/auth/login');
      } else {
        req.flash('error', `Invalid email`)
        return res.redirect('/auth/reset');
      }
    });
  } catch (err) {
    console.log('reset password:', err);
  }
});

module.exports = router;