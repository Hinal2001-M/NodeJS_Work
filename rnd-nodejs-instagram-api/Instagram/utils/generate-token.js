const jwt  = require('jsonwebtoken');

const generateAccessToken = (user) =>{
    return jwt.sign(
        {username: user.username, role: user.role,_id:user._id},
        "mySecretKeyFromenv",
        {expiresIn : "2min"}
    );
};

const generateRefreshToken = (user) =>{
    return jwt.sign(
        {username: user.username, role: user.role,_id:user._id},
        "myRefreshKeyFromenv",
    );
};

module.exports={
    generateAccessToken,
    generateRefreshToken
}
