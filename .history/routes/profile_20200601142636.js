const { Router } = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = Router();

router.get('/', auth, async (req, res) => {
    res.render('profile', {
        title: 'Profile',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        Object.assign(user, req.body);
        await user.save();
        res.status(422).render('profile', {
            title: 'Profile',
            isProfile: true,
            user: req.user.toObject()
        })

    } catch (err) {

    }
})

module.exports = router;
