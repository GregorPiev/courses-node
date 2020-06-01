const { Router } = require('express');
const Course = require('../models/courses');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');
const router = Router();

router.get('/', auth, (req, res) => {
    console.info('Enter in get list');
    res.render('add', {
        title: 'Add new Course',
        isAdd: true
    });
});

router.post('/', auth, async (req, res) => {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    });

    try {
        await course.save();
    } catch (er) {
        console.log('Add=>save course:', e);
    }
    res.redirect('/courses');
});

module.exports = router;