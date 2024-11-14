const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { GraphQLError } = require('graphql');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const Queue = require('bull');
const scheduleQueue = new Queue('scheduleQueue');
const cron = require('node-cron');
const emailQueue = new Queue('emailQueue', {
    redis: {
        port: process.env.REDIS_PORT, host: process.env.REDIS_HOST,
    },
    limiter:{
        max: 10,
        duration: 20000,
    }
});
require('dotenv').config();
const auth = require('../../utils/auth');

var defaultLogger = (message, logType, logLevel) => {
    console.log(`${logType} [${logLevel}]: ${message}`);
};

async function register(parent, args, context) {
    const { models } = context;
    const { email, password, name } = args.details;
    try {
        const findUser = await models.user.findOne({ where: { email: { [Op.iLike]: `%${email}%` } } });
        if (findUser) {
            const error = new GraphQLError('user already exist');
            throw error;
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await models.user.create({
            name,
            email,
            password: passwordHash
        });
        return user;
    } catch (error) {
        return error;
    }
};

async function login(parent, args, context) {
    const { models } = context
    const { email, password } = args.Credentials;
    try {
        const findUser = await models.user.findOne({ where: { email: { [Op.iLike]: `%${email}%` } } });
        if (!findUser) {
            const error = new GraphQLError('user not found', {
                extensions: {
                    code: 'NOT_FOUND',
                    http: {
                        status: 401,
                    },
                },
            });
            throw error;
        }
        const passwordMatch = await bcrypt.compare(password, findUser.password)
        if (!passwordMatch) {
            const error = new GraphQLError('user not found', {
                extensions: {
                    code: 'NOT_FOUND',
                    http: {
                        status: 401,
                    },
                }
            });
            throw error;
        }
        const token = await jwt.sign({ id: findUser.id, email: findUser.email }, 'graphql-practice', { expiresIn: '2h' });
        return token;
    } catch (error) {
        return error
    }
};

async function changePassword(_, args, context) {
    const { oldPassword, newPassword } = args;
    const { models, user } = context;
    try {
        const findUser = await models.user.findByPk(user.id);
        const passwordMatch = await auth.compareHash(oldPassword, findUser.password);
        if (!passwordMatch) {
            throw new GraphQLError('Invalid password');
        }
        const passwordHash = await auth.generateHash(newPassword);
        await findUser.update({ password: passwordHash });
        return 'Password changed';
    } catch (error) {
        return error;
    }
};

async function resetRequest(_, args, context) {
    const { email } = args;
    const { models } = context;
    try {
        const user = await models.user.findOne({ where: { email: { [Op.iLike]: `%${email}%` } } });
        if (!user) {
            throw new GraphQLError('User not found');
        }
        const token = auth.generateToken({ id: user.id });

        const link = `http://localhost:4000?resetToken=${token}`;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'hinal.logicwind@gmail.com',
                pass: 'rckrayfeeznpraty',
            },
        });

        const mailOptions = {
            from: '"Hinal Mehta" <hinal.logicwind@gmail.com>',
            to: email,
            subject: 'Reset password',
            html: `<p>Click on this <a href="${link}">link</a> to reset your password</p>`,
        };

        await transporter.sendMail(mailOptions);

        return 'Reset E-mail sent!';
    } catch (error) {
        return error;
    }
}

async function resetPassword(_, args, context) {
    const { resetToken } = context.req.query;
    const { models } = context;
    try {
        const decoded = auth.verifyToken(resetToken);
        if (!decoded) {
            throw new GraphQLError('Invalid token');
        }

        const user = await models.user.findByPk(decoded.id);
        if (!user) {
            throw new GraphQLError('User not found');
        }

        user.password = await auth.generateHash(args.password);
        await user.save();
        return 'Password reset successful!';
    } catch (error) {
        return error;
    }
}

async function logout(_, args, context) {
    try {
        const token = context.req.headers?.authorization;
        const decoded = jwt.verify(token, process.env.jwt_key);
        if (!decoded) {
            throw new GraphQLError('Invalid token');
        }
    } catch (error) {
        return error;
    }
    return 'Logout success!';
};

async function sendMailToAll(_, args, context) {
    const { models } = context;
    try {
        const users = await models.user.findAll();
        for (let user of users) {
            try {
                await emailQueue.add({ email:user.email },{
                    delay: 1000,
                    removeOnComplete: true,
                    removeOnFail: true,
                }); 
            } catch (error) {
                console.log('ERROR QUEUE:s',error)
            }
            }
        return "all users are added to email queue";

    } catch (error) {
        defaultLogger(`error from checkContinentAndRedirect=> ${error}`, 'error');
        return error;
    }
};

async function sendScheduleMail(_, args, context) {
    const { models } = context;
    try {
        const users = await models.user.findAll();
        for (let user of users) {
            try {
                await emailQueue.add({ email:user.email },{
                    delay: 1000,
                    removeOnComplete: true,
                    removeOnFail: true,
                }); 
            } catch (error) {
                console.log('ERROR QUEUE:s',error)
            }
            }
        
        return "All users have been added to scheduled email queue";

    } catch (error) {
        defaultLogger(`error from checkContinentAndRedirect=> ${error}`, 'error');
        return error
    }
}

module.exports = {
    Mutation: {
        register,
        login,
        logout,
        resetRequest,
        resetPassword,
        changePassword,
        sendMailToAll,
        sendScheduleMail
    }
}