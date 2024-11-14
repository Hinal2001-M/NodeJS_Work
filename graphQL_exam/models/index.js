const { sequelizeInstance } = require('../db-connection');
const user = require('./user');
const event = require('./event');
const eventAttendees = require('./event-attendees');

const models = {
  user,
  event,
  eventAttendees
};

Object.keys(models).forEach((name) => {
  if ('associate' in models[name]) {
    models[name].associate(models);
  }
});

sequelizeInstance.models = models;

module.exports = { sequelizeInstance, models };