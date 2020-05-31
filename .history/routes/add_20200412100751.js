const {Router} = require('express');
const Course = require('../models/courses');
const router = Router();

router.get('/', (req, res) => {
     res.render('add', {
        title: 'Add new Course',
        isAdd: true
    }); 
});

router.post('/', (req, res) => {    
    console.log('Added Course:', req.body);
    const cource = new Course(req.body.title, req.body.price, req.body.img);
    cource.save();
    res.redirect('/courses');
});

module.exports = router;