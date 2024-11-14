const express = require('express');
const userController = require('../controller/userController');
const authentication = require('../middleware/authentication');

const validators = require('../middleware/validators');

const router = express.Router();

router.post('/register', validators.registrationValidation, userController.register);
router.post('/login', validators.loginValidation, userController.login);
router.post('/logout', authentication, userController.logout);
router.post('/change-password', validators.changePasswordValidation, authentication, userController.changePassword);
router.post('/request-password',userController.requestReset);
router.post('/reset-password', validators.resetPasswordValidation, userController.resetPassword);

module.exports = router;