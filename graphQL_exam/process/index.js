const Queue = require('bull');
const scheduleQueue = new Queue('scheduleQueue');
const emailQueue = new Queue('emailQueue', {
    redis: {
        port: process.env.REDIS_PORT, host: process.env.REDIS_HOST
    },
    limiter: {
        max: 10,
        duration: 20000,
    }
});
const nodemailer = require('nodemailer');
const transporter = require('../mail/transporter');
const cron = require('node-cron');

emailQueue.process(async (job, done) => {
    try {
        const { email } = job.data
        await transporter.sendMail({
            from: '"Hinal Mehta" <process.env.SMTP_USER>',
            to: email,
            subject: "bull implementation",
            html: `<p>Welcome to mail</p>`
        });
        done()

    }
    catch (error) {
        console.log(error)
        throw error
    }
})

emailQueue.on("completed", (job) => {
    console.log(`completed ${job.id}job`)
})

scheduleQueue.process(async (job, done) => {
    try {
        const { name, email } = job.data.user
        cron.schedule('* * * * *', function () {
            transporter.sendMail({
                from: '"Hinal Mehta" <process.env.SMTP_USER>',
                to: email,
                subject: "bull implementation",
                html: `<p>Welcome to mail ${name}</p>`
            });
            done()
        })
    }
    catch (error) {
        console.log(error)
        throw error
    }
})

emailQueue.on("completed", (job) => {
    console.log(`completed ${job.id}job`)
})