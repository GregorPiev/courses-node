const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Course = require('../models/courses');
const auth = require('../middleware/auth');
const moduleCourseValidators = require('../utils/validators');
const router = Router();

router.get('/', auth, (req, res) => {
    console.info('Enter in get list');
    res.render('add', {
        title: 'Add new Course',
        isAdd: true
    });
});
// console.log('courseValidators: ', moduleCourseValidators.courseValidators);

router.post('/', auth, moduleCourseValidators.courseValidators, async (req, res) => {
    const errorsAdd = validationResult(req);
    if (!errorsAdd.isEmpty()) {
        // console.info('Enter in get list after get Error');
        res.status(422).render('add', {
            title: 'Add new Course',
            isAdd: true,
            errorAdd: errorsAdd.array()[0].msg
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
        // console.log('Add=>save course:', er);
    }
    res.redirect('/add');
});

module.exports = router;