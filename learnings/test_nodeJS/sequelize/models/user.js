
const {DataTypes, Sequelize} = require('sequelize');
const sequelize = require ('../middleware/dbConnection');

const user = sequelize.define('user', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    resetToken:{
        type: DataTypes.STRING,
        allowNull: true
    }
});

user.associate = function(models) {
    user.hasMany(models.event,{foreignKey:'host'});
    user.belongsToMany(models.event, {
        foreignKey:'userId',
        as: 'invites',
        through: models.eventInvitees,
    });
};

module.exports = user;