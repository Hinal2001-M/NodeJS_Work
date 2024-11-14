const {validationResult} = require('express-validator');
const event = require('../models/event');
const {models, sequelize} = require('../models/index');

module.exports.createEvent = async (req, res) => {
    const { title, location, date } = req.body;
    const transaction = await sequelize.transaction();
    try {
      const newEvent = await models.event.create({
        title,
        location,
        date,
        host: req.user.id,
      },{transaction});

      await models.eventInvitees.create({
        eventId:newEvent.id,
        userId:req.user.id
      },{transaction});

      await transaction.commit();
      res.status(201).json({ newEvent });
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({
        name: error.name,
        message: error.message,
        data: error.data,
      });
    }
  };
  
  module.exports.getEvents = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sortBy = req.query.sortBy || 'title';
    const order = req.query.order || 'ASC';
    try {
      const events = await models.event.findAll({
        where: {
          host: req.user.id,
          ...(req.query.date && { date: req.query.date }),
          ...(req.query.title && { title: { [Op.iLike]: `%${req.query.title}%` } }),
        },
        order: [[sortBy, order]],
        limit,
        offset: (page - 1) * limit,
        include: [
          {
            model: models.user,
            as: 'hostedBy',
            attributes: ['id','email'],
          },
          {
            model: models.user,
            as: 'attendees',
            through:{
              attributes:[]
            },
            attributes: ['id','email'],
          },
        ],
        attributes: ['id', 'title', 'location', 'date'],
      });
      res.status(200).json({ events });
    } catch (error) {
      res.status(400).json({
        name: error.name,
        message: error.message,
        data: error.data,
      });
    }
  };
  
  module.exports.getEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
      const eventDetails = await models.event.findByPk(eventId, {
        include: [
          {
            model: models.user,
            as: 'hostedBy',
            attributes: ['id', 'firstName'],
          },
          {
            model: models.user,
            as: 'attendees',
            attributes: ['id', 'firstName'],
          },
        ],
      });
      if (!eventDetails) {
        throw new Error('Event not found');
      }
      res.status(200).json({ eventDetails });
    } catch (error) {
      res.status(400).json({
        name: error.name,
        message: error.message,
        data: error.data,
      });
    }
  };
  
  module.exports.updateEvent = async (req, res) => {
    const { eventId } = req.params;
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        const error = new Error('oh!!! failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const updateEvent = await models.event.findByPk(eventId);
    if (!updateEvent) {
        throw new Error('Event not found');
      }
      if (updateEvent.host !== req.user.id) {
        throw new Error('didnt authorize');
      }
      await updateEvent.update(req.body, {
        where: {
          id: eventId,
        },
      });
      res.status(200).json({ message: 'Event updated' });
    } catch (error) {
      res.status(400).json({
        name: error.name,
        message: error.message,
        data: error.data,
      });
    }
  };
  
module.exports.inviteUser = async (req, res) => {
    const { eventId } = req.params;
    const { email } = req.body;
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        const error = new Error('It is failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const eventInvite = await models.event.findByPk(eventId);
      if (!eventInvite) {
        throw new Error('Event not found');
      }
      if (eventInvite.host !== req.user.id) {
        throw new Error('didnt authorize');
      }
      const Inviteduser = await models.user.findOne({
        where: {
          email,
        },
      });
      if(!Inviteduser){
        throw new Error('user not found')
      }
      if(eventInvite.host === Inviteduser.id){
        throw new Error('you cannot invite yourself')
      }
      await models.eventInvitees.create({
        eventId,
        userId: Inviteduser.id,
      });
      res.status(200).json({ message: 'User invited' });
    } catch (error) {
      res.status(400).json({
        name: error.name,
        message: error.message,
        data: error.data,
      });
    }
  };
  
module.exports.getInvites = async (req, res) => {
    try {
      const invites = await models.eventInvitees.findAll({
        where: {
          userId: req.user.id,
        },
        include:[{
          model: models.event,
          as: 'event',
          include: [{
            model: models.user,
            as: 'hostedBy',
            attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt','resetToken'] },
            }, {
            model: models.user,
            as: 'attendees',
            through: {
              attributes: [],
            },
            attributes:['id','firstName','lastName','email']
          }],
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'host'] },
        }],
        attributes: {exclude:['userId','eventId','createdAt','updatedAt']}
      })
      res.status(200).json({ invites });
    } catch (error) {
      res.status(400).json({
        name: error.name,
        message: error.message,
        data: error.data,
      });
    }
};
  