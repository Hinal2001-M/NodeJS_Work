const bcrypt = require('bcrypt');
const User = require('../models/user');


const getUserByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await user.findOne({ username: username });
        if (!user) {
            throw new Error('user does not exist');
        }
        const { password, jwtToken, __v, role, ...OtherInfo } = user._doc;
        res.status(200).send({
            status: "success",
            message: "user Info",
            user: "otherInfo",
        });
    } catch (error) {
        res.status(500).send({
            status: "fail",
            message: error.message,
        });
    }
}

const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await user.findOne({ _id: id });
        if (!user) {
            throw new Error('user does not exist');
        }
        const { password, jwtToken, __v, role, ...OtherInfo } = user.doc;
        res.status(200).send({
            status: "success",
            message: "user Info",
            user: "otherInfo",
        });
    } catch (error) {
        res.status(500).send({
            status: "fail",
            message: error.message,
        })
    }
}

const updateUser = async (req, res) => {
    if (req.user._id === req.params.id || req.user.role === 'admin') {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                res.status(500).send({
                    status: "fail",
                    message: error.message
                });
            }
        }
        try {
            const user = await user.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            );
            const { jwtToken, password, ...other } = user.doc;
            if (!user) {
                return res.status(400).send({
                    status: "fail",
                    message: "you can't update this account"
                });
            }
            res.status(200).send({
                status: " success",
                message: "account has been update successfully",
                user: other
            });
        } catch (error) {
            res.status(500).send({
                status: 'fail',
                message: "something went wrong",
            });
        }
    } else {
        return res.status(400).send({
            status: "fail",
            message: "you can't update this account"
        })
    }
}

const getFollowings = async (req, res) => {
    try {
        const username = req.params.username;
        const userFollowings = await user.findOne({ username: username });
        if (!userFollowings) {
            throw new Error('user does not exist');
        }
        const followings = await Promise.all(
            userFollowings.followings.map((followings) => {
                return user.findById(followings, {
                    username: true,
                    profilePicture: true,
                });
            })
        );
        res.status(200).send({
            status: "success",
            message: "user Info",
            followings: followings,
        });
    } catch (error) {
        res.status(500).send({
            status: 'fail',
            message: error.message
        });
    }
}

const getFollowers = async (req, res) => {
    try {
        const username = req.params.username;
        const userFollowers = await user.findOne({ username: username });
        if (!userFollowers) {
            throw new Error('user does not exist');
        }
        const followers = await Promise.all(
            userFollowers.followers.map((followers) => {
                return user.findById(followers, {
                    username: true,
                    profilePicture: true,
                });
            })
        );
        res.status(200).send({
            status: "success",
            message: "user Info",
            data: {
                followings: followers,
            },
        });
    } catch (error) {
        res.status(500).send({
            status: "fail",
            message: error.message
        });
    }
}

const followUser = async (req, res) => {
    try {
        const currentUser = await user.findById({ _id: req.user._id });
        if (currentUser.username !== req.params.username) {
            const userToFollow = await user.findOne({
                username: req.params.username,
            });
            if (!userToFollow) {
                throw new Error("user doesn't exist");
            }
            if (!currentUser.followings.includes(userToFollow._id)) {
                await currentUser.updateOne({
                    $push: { followings: userToFollow._id },
                });
                await userToFollow.updateOne({
                    $push: { followers: currentUser._id },
                });
                res.status(200).send({
                    status: " success",
                    message: "user has been Followed"
                });
            } else {
                res.status(400).send({
                    status: "success",
                    message: "you already follow this user",
                });
            }
        } else {
            throw new Error("you can not follow yourSelf");
        }
    } catch (error) {
        res.status(500).send({
            status: 'fail',
            message: error.message
        })
    }
}

const unFollowUser = async (req, res) => {
    try {
        const currentUser = await User.findById({ _id: req.user._id });
        if (currentUser.username !== req.params.username) {
            const usertounfollow = await User.findOne({
                username: req.params.username,
            });
            if (!usertounfollow) {
                throw new Error("user does not exist");
            }
            if (currentUser.followings.includes(usertounfollow._id)) {
                await currentUser.updateOne({
                    $pull: { followings: usertounfollow._id },
                });
                await usertounfollow.updateOne({
                    $pull: { followers: currentUser._id },
                });
                res.status(200).send({
                    status: "success",
                    message: "user has been unfollowed",
                });
            } else {
                res.status(400).send({
                    status: "success",
                    message: "you don't follow this user",
                });
            }
        } else {
            throw new Error("you can't unfollow yourself");
        }
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: error.message,
        });
    }
};

const searchUsers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        const users = await User.find({
            username: { $regex: search, $options: "i" },
        })
            .select("_id username profilePicture")
            .limit(limit);
        const totalUsers = users.length;
        res.status(200).send({
            status: "success",
            totalUsers: totalUsers,
            limit: limit,
            users: users,
        });
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: error.message,
        });
    }
};

module.exports = {
    getUserByUsername,
    getUser,
    updateUser,
    getFollowings,
    getFollowers,
    followUser,
    unFollowUser,
    searchUsers
};