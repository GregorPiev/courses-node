const {Router} = require('express');
const router = Router();
const Card = require('../models/card');
const Course = require('../models/courses');

router.post('/add', async (req, res) => {
   const course = await Course.getById(req.body.id);
   await Card.add(course);
   res.redirect('/card');
});

module.exports = router;