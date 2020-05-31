var colorSet = {
   Reset: "\x1b[0m",
   Red: "\x1b[31m",
   Green: "\x1b[32m",
   Yellow: "\x1b[33m",
   Blue: "\x1b[34m",
   Magenta: "\x1b[35m"
};

var funcNames = ["info", "log", "warn", "error"];
var colors = [colorSet.Green, colorSet.Blue, colorSet.Yellow, colorSet.Red];

const { Router } = require('express');
const router = Router();
// const Card = require('../models/card'); Old in order working without MongoDB
const Course = require('../models/courses');
console.log('%cCart:', 'color: red;')

router.post('/add', async (req, res) => {
   console.info('%cAdd to cart:' + req.body.id, 'color: red;')
   const course = await Course.findById(req.body.id);
   // await Card.add(course);
   await req.user.addToCart(course);
   res.redirect('/card');
});

router.get('/', async (req, res) => {
  /*  const card = await Card.fetch();
   res.render('card', {
      title: 'Card:',
      isCard: true,
      courses: card.courses,
      price: card.price
   }); */
   res.render('card', {
      title: 'Card:',
      isCard: true,
      courses: [],
      price: 0
   });
});

router.delete('/remove/:id', async (req, res) => {
   const card = await Card.remove(req.params.id);
   res.status(200).json(card);
});

module.exports = router;