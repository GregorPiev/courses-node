const { check } = require("express-validator");

exports.registerValidators = [
    check('email').isEmail()
];