const { Router } = require('express');
const Order = require('../models/order');
const router = Router();

router.get('/', async (req, res) => {
    const orders = await Order.find({'user.userId': req.user._id})
    .populate('user.userId');
    try {
        res.render('orders', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.course.reduce((total, c) => {
                        return total+=c.count*c.course.price;
                    }, 0)
                }
            })
        });
    } catch (err) {
        console.error('Get list of orders:', err);
    }
});

router.post('/', async (req, res) => {   
   try{   
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    console.warn('Orders post 2');

    const courses = user.cart.items.map(i => ({
        count: i.count,
        course: { ...i.courseId._doc }
    })); 

    const order = new Order({
        user: {
            name: req.user.name,
            userId: req.user
        },
        courses: courses
    }); 

        await order.save(); 
        await req.user.clearCart();
        res.redirect('/orders');
   }catch(err){
     console.error('Order error:', err);
   } 
    

});

module.exports = router;