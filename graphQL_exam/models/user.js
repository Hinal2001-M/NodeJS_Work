const { DataTypes } = require('sequelize');
const sequelize = require('../db-connection');
const Instance = sequelize.sequelizeInstance;

const User = Instance.define('user', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    paranoid: true,
});

User.associate = function (models) {
    User.hasMany(models.event, { foreignKey: 'host' });
    User.belongsTo(models.event, {
        foreignKey: 'attendees',
        as: 'invites',
        through: models.eventAttendees,
    });
};

module.exports = User;