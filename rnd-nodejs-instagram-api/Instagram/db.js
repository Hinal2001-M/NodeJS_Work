const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    'insta-db',
    'postgres',
    'honey8201',
    {
        host: process.env.DATABASE_HOST,
        dialect: 'postgres',
        port: 8000
    },
)

const connectDB = async (req, res) => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database');
    } catch (error) {
        console.error({
            name: error.name,
            message: error.message,
        });
    }
}

module.exports.connectDB = connectDB;




// const mongoose = require('mongoose');
// const URI = 'mongodb://localhost:27017/insta-db';

// const connectDB = async () => {
//     try {
//         const con = await mongoose.connect(URI);
//         console.log("DB Connected Successfully");
//     } catch (e) {
//         console.log(`Authentication to database failed!!!`);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;