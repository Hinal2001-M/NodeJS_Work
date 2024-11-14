const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.compareHash = async (password, hash) => {
    const passwordMatch = await bcrypt.compare(password, hash);
    return passwordMatch;
};

module.exports.generateHash = async (password) => { 
    const hash = await bcrypt.hash(password, 10);
    return hash;
};

module.exports.generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.jwt_key, { expiresIn: '1h' });
    return token;
};

module.exports.verifyToken = (token) => {
    const decoded = jwt.verify(token, process.env.jwt_key);
    return decoded;
};