const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generate-token');


const signup = async (req, res) => {
    try {
        const data = req.body;
        const { username, password, email } = data;
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);
        const createUser = new user({
            username: username,
            password: password,
            email: email
        });
        const saveUser = await createUser.save();
        res.status(200).send({
            status: 'success',
            message: 'user saved successfully',
            data: {
                user: username
            }
        });
    } catch (error) {
        res.status(500).send({
            status: 'fail',
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await user.findOne({ username: username });
        if (!user) {
            return res.status(401).send({
                status: 'fail',
                message: "doesn't exist"
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send({
                status: "fail",
                message: "password is incorrect"
            });
        }
        const accessToken = generateToken.generateAccessToken(user);
        const refreshToken = generateToken.generateRefreshToken(user);
        await user.findByIDAndUpdate(user._id, {
            jwtToken: refreshToken
        });
        const { jwtToken, password: newPass, ...other } = user._doc;
        res.status(200).send({
            status: "success",
            message: "logged in successfully",
            data: other,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(500).send({
            status: 'fail',
            message: error.message,
        });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await user.updateOne({ jwtToken: refreshToken }, [
                { $unset: ["jwtToken"] },
            ]);
            res.status(200).send({
                status: "fail",
                message: "logout error"
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "fail",
            message: error.message
        });
    }
};

const verify = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(403).json("You are not authorized");
    }
    const token = authHeader.split(" ")[1];
    try {
        if (authHeader) {
            jwt.verify(token, "YOUR_SECRET_KEY", (err, user) => {
                if (err) {
                    throw new Error("token is not valid!");
                }
                req.user = user;
                next();
            });
        }
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
};
const refresh = async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) {
        res.status(401).send({
            status: "failure",
            message: "You are not authenticated!",
        });
    }
    try {
        const token = await User.findOne(
            { jwtToken: refreshToken },
            { jwtToken: true }
        );
        if (!token) {
            res.status(200).send({
                status: "failure",
                message: "Refresh token is not valid!",
            });
        }
        jwt.verify(
            refreshToken,
            "YOUR_SECRETKEY_REFRESHTOKEN",
            async (err, user) => {
                if (err) {
                    throw new Error("token is not valid!");
                }
                const newAccessToken = generateToken.generateAccessToken(user);
                const newRefreshToken = generateToken.generateRefreshToken(user);
                await User.updateOne(
                    { jwtToken: refreshToken },
                    { $set: { jwtToken: newRefreshToken } }
                );
                res.status(200).json({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                });
            }
        );
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
};


module.exports = {
    signup,
    login,
    logout,
    verify,
    refresh
}