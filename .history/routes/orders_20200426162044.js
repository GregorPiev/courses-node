const { Router } = require('express');
const Order = require('../models/order');
const router = Router();

router.get('/', async (req, res) => {
    try {
        res.render('orders', {
            isOrder: true,
            title: 'Orders'
        });
    } catch(err) {
        console.error('Get list of orders:', err);
    }
    
});

router.post('/', async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate();

        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: { ...i.courseId._doc }
        }));

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req, user
            },
            courses: courses
        });

        await order.save();
        await user.clearCart();
        res.redirect('/orders');
    } catch (err) {
        console.error('Error post order:', err);
    }


});

module.exports = router;