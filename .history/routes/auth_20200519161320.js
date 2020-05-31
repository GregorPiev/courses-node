const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { check, oneOf, body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const router = Router();
const keys = require('../keys/');
const regEmail = require('../emails/registrations');
const resetEmail = require('../emails/reset');
const registerValidators = require('../utils/validators');


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

router.post('/register',
  [
    check('email')
      .isEmail().withMessage("Enter valid Email")
      .custom(async (value, { req }) => {
        try {
          console.log('Email value:', value);
          const candidate = await User.findOne({ email: value });
          console.log('candidate:', candidate);
          if (candidate) {
            console.warn('candidate is exist');
            return Promise.reject('The same email exist already');
          }
        } catch (err) {
          console.log('Is email exist test:', err)
        }
      })
      .normalizeEmail(),
    check('password', 'Password must be at list 6 symbols')
      .isLength({ min: 6, max: 56 })
      .isAlphanumeric()
      .trim(),
    check('confirm')
      .custom((value, { req }) => {
        const password = req.body.password;
        console.log('password:', password)
        console.log('confirm:', value)
        if (value !== password) {
          throw new Error('Confirm must equal to password')
        }
        return true;
      })
      .trim(),
    check('name')
      .isLength({ min: 3 }).withMessage('Length of Name must be at list 3 symbols')

  ]
  , async (req, res) => {
    try {
      const { email, password, name } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('registerError', errors.array()[0].msg);
        return res.status(422).redirect('/auth/login#register');
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email, name, password: hashPassword, cart: { items: [] }
      });
      user.save();
      res.redirect('/auth/login#login');
      await transporter.sendMail(regEmail(email));

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

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (!user) {
      return res.redirect('/auth/login');
    } else {
      res.render('auth/password', {
        title: 'New password?',
        error: req.flash('error'),
        userId: user._id,
        token: req.params.token

      });
    }

  } catch (err) {
    console.error('Error get restore password:', err);
    return res.redirect('/auth/login');
  }
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

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect('/auth/login');
    } else {
      console.error('Not valid user');
      req.flash('error', 'Not valid user')
      res.redirect('/auth/reset');
    }
  } catch (err) {
    console.error(err);
  };
});

module.exports = router;