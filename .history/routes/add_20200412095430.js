const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
     res.render('add', {
        title: 'Add new Course',
        isAdd: true
    }); 
});

router.post('/', (req, res) => {
    console.log('Added Course 1:', req);
    console.log('Added Course:', req.body);
    res.redirect('/courses');
});

module.exports = router;