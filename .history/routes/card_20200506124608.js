const { funcNames } = require('../colors');

const { Router } = require('express');
const Course = require('../models/courses');
const router = Router();
// const Card = require('../models/card'); Old in order working without MongoDB
const auth = require('../middleware/auth');

function mapCartItems(cart) {
   return cart.items.map(i => ({
      ...i.courseId._doc,
      id: i.courseId.id, 
      count: i.count
   })
   );
}

function computePrice(courses) {
   return courses.reduce((total, course) => {
      return total + course.count * course.price;
   }, 0);
}


router.post('/add', auth, async (req, res) => {
   console.warn('Add to cart:', req.body.id);
   const course = await Course.findById(req.body.id);
   // await Card.add(course);
   await req.user.addToCart(course);
   res.redirect('/card');
});

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCard(req.params.id);
  const user = await req.user.populate('cart.items.courseId').execPopulate();
  const courses = mapCartItems(user.cart);
  cart = {
    courses ,
    price: computePrice(courses)
  }
   res.status(200).json(cart);
});

router.get('/', auth, async (req, res) => {
   const curUser = req.session.user;
   console.info('User:', curUser);
   const user = await curUser
      .populate('cart.items.courseId')
      .execPopulate();
   
   const courses = mapCartItems(user.cart);
   

   res.render('card', {
      title: 'Cart',
      isCard: true,
      courses: courses,
      price: computePrice(courses)
   })

});



module.exports = router;