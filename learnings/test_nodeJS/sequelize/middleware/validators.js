const {body} = require('express-validator');

module.exports.registrationValidation = [
    body('email')
    .isEmail()
    .withMessage('enter correct mail!!!')
    .normalizeEmail(),

    body('password')
    .trim()
    .notEmpty()
    .withMessage('password required')
    .isLength({min:5}).withMessage('password must be minimum 5 length or more')
    .matches(/(?=.*?[A-Z])/).withMessage('Atleast one Uppercase')
    .matches(/(?=.*?[0-9])/).withMessage('Atleast one Number')
    .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('Atleast one special character')
    .not().matches(/^$|\s+/).withMessage('space not allowed'),

    body('firstName')
    .matches(/^[a-zA-Z ]*$/)
    .withMessage('Name should not contain any numbers or special characters.'),

    body('lastsName')
    .matches(/^[a-zA-Z ]*$/)
    .withMessage('Name should not contain any numbers or special characters.'),
];
module.exports.loginValidation = [
    body('email')
    .isEmail()
    .withMessage('enter correct mail!!!')
    .normalizeEmail(),

    body('password')
    .trim()
    .notEmpty()
    .withMessage('password required')
    .isLength({min:5}).withMessage('password must be minimum 8 length or more')
    .matches(/(?=.*?[A-Z])/).withMessage('Atleast one Uppercase')
    .matches(/(?=.*?[0-9])/).withMessage('Atleast one Number')
    .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('Atleast one special character')
    .not().matches(/^$|\s+/).withMessage('space not allowed'),
];
module.exports.changePasswordValidation = [
    body('oldPassword')
    .trim()
    .notEmpty()
    .withMessage('password required')
    .isLength({min:5}).withMessage('password must be minimum 5 length or more')
    .matches(/(?=.*?[A-Z])/).withMessage('Atleast one Uppercase')
    .matches(/(?=.*?[0-9])/).withMessage('Atleast one Number')
    .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('Atleast one special character')
    .not().matches(/^$|\s+/).withMessage('space not allowed'),

    body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('password required')
    .isLength({min:5}).withMessage('password must be minimum 8 length or more')
    .matches(/(?=.*?[A-Z])/).withMessage('Atleast one Uppercase')
    .matches(/(?=.*?[0-9])/).withMessage('Atleast one Number')
    .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('Atleast one special character')
    .not().matches(/^$|\s+/).withMessage('space not allowed'),
];
module.exports.resetPasswordValidation = [
    body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('password required')
    .isLength({min:5}).withMessage('password must be minimum 5 length or more')
    .matches(/(?=.*?[A-Z])/).withMessage('Atleast one Uppercase')
    .matches(/(?=.*?[0-9])/).withMessage('Atleast one Number')
    .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('Atleast one special character')
    .not().matches(/^$|\s+/).withMessage('space not allowed'),
];
module.exports.createEventValidators = [
    body('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter title.'),
  body('date')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter date.'),
  body('location')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter location.'),
];
