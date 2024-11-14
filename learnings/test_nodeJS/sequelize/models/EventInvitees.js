const {DataTypes} = require('sequelize');
const sequelize = require ('../middleware/dbConnection');
const User = require('./user');
const Event = require('./event');

const EventInvitees = sequelize .define('eventInvitees', {
    userId: {
        type: DataTypes.INTEGER,
        references:{
            model: User,
            key:'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    eventId: {
        type: DataTypes.INTEGER,
        references:{
            model: Event,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }
});

EventInvitees.associate = function(models) {
    EventInvitees.belongsTo(models.event, {
        foreignKey: 'eventId',
        as: 'event',
    });
    EventInvitees.hasMany(models.user, {
        foreignKey:'userId',
        as:'attendees',
    });
};

module.exports = EventInvitees;