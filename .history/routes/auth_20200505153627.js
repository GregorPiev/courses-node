const { Router } = require ('express');
const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
      title: 'Sign In',
      isLogin: true
  });
});

router.post('/login', async(req, res) => {
  req.session.isAuthenticated = true;
  res.redirect('/');
});

router.get('/logout', async(req, res) => {
  req.session.isAuthenticated = false;
  res.redirect('/auth/login#login');
})


module.exports = router;