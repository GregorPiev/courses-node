const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
     res.render('add', {
        title: 'Add new Course',
        isAdd: true
    }); 
});

router.post('/', (req, res) => {
    console.log(req.body);
});

module.exports = router;