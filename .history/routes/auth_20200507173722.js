const { Router } = require ('express');
const User = require('../models/user');
const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
      title: 'Sign In',
      isLogin: true
  });
});

router.post('/login', async(req, res) => {
  const user = await User.findById('5ea031542dc88029f49d1e76');
  req.session.user = user;
  req.session.isAuthenticated = true;
  req.session.save(err => {
     if(err) {
       throw(err);
     }
     res.redirect('/');
  });
});

router.get('/logout', async(req, res) => {
  req.user = null;
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
})

router.post('/register', async(req, res) => {
   try{
     const {email, password, repeat, name} = req.body;
     const candidate = await User.findOne({email});
     
     if (candidate) {
       res.redirect('/auth/login#reqister');
     } else {
         const user = new User({
           email, name, password
         });
         user.save();
     }
   } catch (err) {
     console.error('Trgister error:', err);
   }
});


module.exports = router;