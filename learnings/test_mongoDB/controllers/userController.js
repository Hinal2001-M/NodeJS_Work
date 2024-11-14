const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user')
require('dotenv').config();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

function checkValidationErrors(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed');
        error.status = 422;
        error.data = errors.array();
        throw error;
    }
}

module.exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    try {
        checkValidationErrors(req);

        const passwordHash = await bcrypt.hash(password, saltRounds);

        /*const regex = new RegExp(String, 'i')
        const findUser = await models.user.findOne({where:{email}}).exec();
        if(findUser){
            const error = new Error('user already exist');
            throw error;
        }*/

        const newUser = await User.create({
            name,
            email,
            password: passwordHash
        });
        res.status(201).json({ newUser });
    } catch (error) {

        res.status(400).json({
            name: error.name,
            message: error.message,
            data: error.data,
        });
    };
};

function userNotFound(user) {
    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
}

function checkPassword(password) {
    if (!password) {
        const error = new Error('Incorrect password');
        error.status = 401;
        throw error;
    }
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        checkValidationErrors(req);

        const regex = new RegExp(String, 'i')
        const loginUser = await User.findOne({ email }).exec();
        userNotFound(loginUser);

        const passwordMatch = await bcrypt.compare(password, loginUser.password);
        checkPassword(passwordMatch);

        const token = jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET, { expiresIn: '2hrs' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).json({ token });
    } catch (error) {
        res.status(error.status || 500).json({
            name: error.name,
            message: error.message,
            data: error.data,
        });
    };
};

module.exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout Successfully Done' });
};

module.exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const saltRounds = 10;

    try {
        checkValidationErrors(req);

        const user = await User.findById(req.user.id).exec();
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        checkPassword(passwordMatch);

        const passwordHash = await bcrypt.hash(newPassword, saltRounds);
        user.password = passwordHash;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(error.status || 500).json({
            name: error.name,
            message: error.message,
            data: error.data,
        });
    };
};

module.exports.requestReset = async (req, res) => {
    const email = req.body.email;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const User = await user.findOne({ email });
        if (!User) {
            throw new Error("User doesn't exist");
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        User.resetToken = resetToken;
        await User.save();
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'hinal.logicwind@gmail.com', // generated ethereal user
                pass: 'rckrayfeeznpraty'  // generated ethereal password
            }
        });

        let info = await transporter.sendMail({
            from: '"Hinal Mehta" <hinal.logicwind@gmail.com >', // sender address
            to: email, // list of receivers
            subject: 'Password Reset Link', // Subject line
            html: `<p>Click the link to reset your password: <a href="http://localhost:8080/reset-password/${resetToken}">http://localhost:8080/reset-password/${resetToken}</a></p>` // html body
        });

        console.log('Message sent: %s', info.messageId);

        res.status(200).json({ message: 'Reset link sent' });
    } catch (error) {
        res.status(400).json({
            name: error.name,
            message: error.message,
            data: error.data,
        });
    }
};

module.exports.resetPassword = async (req, res) => {
    const { email, resetToken, newPassword } = req.body;
    const saltRounds = 10;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const User = await user.findOne({ email, resetToken }).exec();
        if (!User) {
            throw new Error("Invalid reset token");
        }
        console.log("token validation done!")

        const passwordHash = await bcrypt.hash(newPassword, saltRounds);
        User.resetToken = null;
        User.password = passwordHash;
        await User.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({
            name: error.name,
            message: error.message,
            data: error.data,
        });
    };
};


