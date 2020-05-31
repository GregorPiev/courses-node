const { check, validationResult } = require("express-validator");

exports.registerValidators = [
    check('email').isEmail()
];