const {DataTypes} = require('sequelize');
const sequelize = require('../middleware/dbConnection');
const User = require('./user');

const event = sequelize.define('event',{
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    host: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }

});

event.associate = function(models) {
  event.belongsTo(models.user, {foreignKey:'host',as:'hostedBy'});
  event.belongsToMany(models.user,{
    foreignKey:'eventId',
    as:'attendees',
    through: models.eventInvitees,
  });
};

module.exports = event;