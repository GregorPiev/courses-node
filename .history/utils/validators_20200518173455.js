const { check, body } = require("express-validator");

exports.registerValidators = [
    body('email').isEmail().withMessage("Enter valid Email"),
    check('password', 'Password must be at list 6 symbols').isLength({ min: 6, max: 56 }).isAlphanumeric(),
    check('confirm').custom((value, req) => {
        if (value !== req.body.password) {
            throw new Error('Conform must equal to password')
        }
        return true;
    }),
    check('name').isLength({ min: 3 }).withMessage('Length must be at list 3 symbols')
];