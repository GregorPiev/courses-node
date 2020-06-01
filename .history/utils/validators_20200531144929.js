const { check, body } = require("express-validator");

exports.registerValidators = [
  check('email').isEmail().withMessage("Enter valid Email"),
  check('password', 'Password must be at list 6 symbols').isLength({ min: 6, max: 56 }).isAlphanumeric()
      /* .custom((val, { req, loc, path }) => {
        if (val !== req.body.confirm) {
          throw new Error('Confirm must equal to password');
        } else {
          return true;
        }
      }) */,
  check('name').isLength({ min: 3 }).withMessage('Length of Name must be at list 3 symbols'),
  check('confirm').custom((value, { req }) => {
    const password = req.body.password;
    console.log('password:', password);
    console.log('confirm:', value);
    if (value !== password) {
      throw new Error('Confirm must equal to password');
    }
    return true;
  })
];

exports.courseValidators = [
  body('title').isLength({ min: 6 }).withMessage('Minimal length 6 symbols').trim(),
  body('price').isNumeric().withMessage('Enter valid price'),
  body('img', 'Enter valid url value').isURL()
];