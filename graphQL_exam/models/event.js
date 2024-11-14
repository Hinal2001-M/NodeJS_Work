const { DataTypes } = require('sequelize');
const User = require('./user');
const { sequelizeInstance } = require('../db-connection');

const Event = sequelizeInstance.define('Event', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    host: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    paranoid: true,
});
    
Event.associate = function (models) {
    Event.belongsTo(models.user, { foreignKey: 'host', as: 'hostedBy' });
    Event.belongsToMany(models.user, {
        foreignKey: 'eventId',
        targetKey: 'email',
        as: 'attendees',
        through: models.eventAttendees,
    });
};

module.exports = Event;
