const { Router } = require('express');
const { check, validationResult, checkSchema } = require('express-validator');
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
console.log('courseValidators: ', checkSchema({ courseValidators }));

router.post('/', auth, courseValidators, async (req, res) => {
    const errorsAdd = courseValidators(req);
    if (!errorsAdd.isEmpty()) {
        return res.status(422).render('/add', {
            title: 'Add new Course',
            isAdd: true,
            errorAdd: errorsAdd.array()[0].msg
        });
    }
    return;

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