const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const {models} = require('../models/index');
const crypto = require('crypto');
const nodemailer = require('nodemailer')
const {Op} = require('sequelize');

module.exports.register = async (req,res)=> {
    const {firstName, lastName, email, password} = req.body;
    const saltRounds = 10;
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            const error = new Error('failed')
            error.data = errors.array();
            throw error;
        }
        const findUser = await models.user.findOne({ where: { email:{[Op.iLike]:email} } });
        if(findUser){
            const error = new Error("user already exist");
            throw error;
        }
        const passwordHash = await bcrypt.hash(password,saltRounds)
        const newUser = await models.user.create({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        res.status(201).json({ newUser });
        }catch(error){
            res.status(400).json({
              name: error.name,
              message: error.message,
              data: error.data,
            });
        };
};
module.exports.login = async (req,res)=> { 
    const{email,password} = req.body;
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('ohh-no!!! failed');
      error.data = errors.array();
      throw error;
    }
    const loginUser = await models.user.findOne({ where: { email:{[Op.iLike]:email} } });
    if (!loginUser) {
      throw new Error('User not found...');
    }
    const passwordMatch = await bcrypt.compare(password, loginUser.password);
    if (!passwordMatch) {
      throw new Error('Password is Invalid!');
    }
    const token = jwt.sign({ id: loginUser.id }, process.env.JWT_KEY, { expiresIn: '30min' });
    res.cookie('token', token, { httpOnly: true 
    });
    res.status(201).json({ token });
    }catch(error){
        res.status(400).json({
          name: error.name,
          message: error.message,
          data: error.data,
        }); 
    };
};

module.exports.logout = (req,res) => {
    res.clearCookie('token');
    res.status(200).json({message: 'Logout Successfully!!!'})
};

module.exports.changePassword = async(req,res)=>{
    const {oldPassword , newPassword} = req.body;
    const saltRounds= 10;
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
        }
        const changeUser = await models.user.findByPk(req.user.id);
        const passwordMatch = await bcrypt.compare(oldPassword, changeUser.password);
        if (!passwordMatch) {
        throw new Error('Invalid password');
    }
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await changeUser.update({ password: passwordHash });
    res.status(200).json({ message: 'Password changed!' });
    }catch(error){
        res.status(400).json({
          name: error.name,
          message: error.message,
          data: error.data,
        });
    };
};

module.exports.requestReset = async (req, res) => {
    const  email  = req.body.email;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const User = await models.user.findOne({where:{email}});
      if (!User) {
        throw new Error("User doesn't exist");
      }
      const resetToken = crypto.randomBytes(32).toString('hex');
      User.resetToken = resetToken;
      await User.save();
      // send email with reset link
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'hinal.logicwind@gmail.com', // generated ethereal user
            pass: 'rckrayfeeznpraty'  // generated ethereal password
        }
      });
    
      // send mail with defined transport object
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
      const User = await models.user.findOne({ where: {email,resetToken } });
      if (!User) {
        throw new Error("Invalid reset token");
      }
      
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);
      User.resetToken=null;
      User.password = passwordHash;
      await User.save();
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(400).json({
        name: error.name,
        message: error.message,
        data: error.data,
      });
    }
  };