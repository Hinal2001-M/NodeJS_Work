const { DataTypes } = require('sequelize');
const Event = require('./event');
const User = require('./user');
const { sequelizeInstance } = require('../db-connection');

const eventAttendees = sequelizeInstance.define('eventAttendees', {
    eventId: {
        type: DataTypes.INTEGER,
        references: {
            model: Event,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    attendee: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'email',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    paranoid: true,
});

eventAttendees.associate = function (models) {
    eventAttendees.belongsTo(models.event, {
        foreignKey: 'eventId',
        as: 'event',
    });
    eventAttendees.belongsTo(models.user, {
        foreignKey: 'attendee',
        targetKey: 'email',
        keyType: DataTypes.STRING,
        as: 'attendees',
    });
};

module.exports = eventAttendees;
