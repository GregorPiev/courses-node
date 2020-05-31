const { Router } = require('express');
const Order = require('../models/order');
const router = Router();

router.get('/', (req, res) => {
    try {
        res.render('orders', {
            isOrder: true,
            title: 'Orders'
        });
    } catch (err) {
        console.error('Get list of orders:', err);
    }
});

router.post('/', async (req, res) => {   
   try{
    console.warn('Orders post 1');
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    console.warn('Orders post 2');

    const courses = user.cart.items.map(i => ({
        count: i.count,
        course: { ...i.courseId._doc }
    }));
    console.warn('Orders post 3:');

    const order = new Order({
        user: {
            name: req.user.name,
            userId: req.user
        },
        courses: courses
    });

    console.warn('Orders post 4');

        await order.save();
        console.info('Orders => Save');

        await req.user.clearCart();
        console.info('Orders => Clear');

        res.redirect('/orders');
   }catch(err){
     console.error('Order error:', err);
   } 
    

});

module.exports = router;