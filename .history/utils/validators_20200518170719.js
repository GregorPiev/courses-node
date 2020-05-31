const { check } = require("express-validator");

exports.registerValidators = [
    check('email').isEmail().withMessage("Enter valid Email")
];