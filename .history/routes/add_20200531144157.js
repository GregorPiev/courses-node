const { Router } = require('express');
const { check, validationResult } = require('express-validator');
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

router.post('/', auth, courseValidators, async (req, res) => {
    const errorsAdd = courseValidators(req);
    if (!errorsAdd.isEmpty()) {
        return res.status(422).render('/add', {
            title: 'Add new Course',
            isAdd: true,
            error: errorsAdd.array()[0].msg
        });
    }

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