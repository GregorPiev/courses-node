const { Router } = require('express');
const Course = require('../models/courses');
const router = Router();

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Add new Course',
        isAdd: true
    });
});

router.post('/', async (req, res) => {
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