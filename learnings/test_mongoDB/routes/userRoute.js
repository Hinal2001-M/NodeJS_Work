const express = require('express');
const userController = require('../controllers/userController');
const authentication = require('../middleware/authentication');
const validators = require('../middleware/validators');


const router = express.Router();

router.post('/register',validators.registrationValidation,userController.register);
router.post('/login', validators.loginValidation, userController.login);
router.post('/logout', authentication,userController.logout);
router.post('/changePassword', validators.changePasswordValidation,authentication,userController.changePassword);
router.post('/requestReset',userController.requestReset);
router.post('/resetPassword',  validators.resetPasswordValidation,userController.resetPassword);

module.exports = router;