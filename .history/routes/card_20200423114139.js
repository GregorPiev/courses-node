const {funcNames} = require('../colors');

const { Router } = require('express');
const Course = require('../models/courses');
const router = Router();
// const Card = require('../models/card'); Old in order working without MongoDB

console.info('Cart:');

router.post('/add', async (req, res) => {
   console.warn('Add to cart:', req.body.id);
   const course = await Course.findById(req.body.id);
   // await Card.add(course);
   await req.user.addToCart(course);
   res.redirect('/card');
});

router.delete('/remove/:id', async (req, res) => {
   const card = await Card.remove(req.params.id);
   res.status(200).json(card);
});

router.get('/', async (req, res) => {
  const user =await req.user
  .populate('cart.items.courseId')
  .execPopulate();

  console.log('user:', user);


  res.render('card', {
     title: 'Cart',
     isCard: true,
     courses: [],
     price: '0'
  })
   
});



module.exports = router;