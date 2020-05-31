const { Router } = require('express');
const router = Router();

router.get('/', async (req, res) => {
    res.render('orders', {
        isOrder: true,
        title: 'Orders'
    })
});

module.exports = router;