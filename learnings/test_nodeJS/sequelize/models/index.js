const sequelize = require('../middleware/dbConnection');
const user = require('./user');
const event = require('./event');
const eventInvitees = require('./EventInvitees');

const models = {
    user,
    event,
    eventInvitees,
};

Object.keys(models).forEach((name)=>{
    if('associate' in models[name]){
        models[name].associate(models);
    }
});

sequelize.models = models;

module.exports = { sequelize, models}