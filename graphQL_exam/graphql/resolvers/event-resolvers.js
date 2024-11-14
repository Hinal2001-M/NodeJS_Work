const { GraphQLError } = require('graphql');
const { Op } = require('sequelize');

async function createEvent(_, args, context) {
    const {
        id, title, location, date, description,
    } = args.eventDetails;
    const { models, sequelizeInstance, user } = context;

    const transaction = await sequelizeInstance.transaction();
    try {
        const event = await models.event.create({
            id,
            title,
            location,
            description,
            date,
            host: user.id,
        }, { transaction });

        await models.eventAttendees.create({
            eventId: event.id,
            attendee: user.email,
            userEmail: user.email
        }, { transaction });

        await transaction.commit();
        return 'event created!';
    } catch (error) {
        await transaction.rollback();
        return error;
    }
}

async function getEvents(_, args, context) {
    const { models } = context;
    const page = context.req.query?.page || 1;
    const limit = context.req.query?.limit || 10;
    const sortBy = context.req.query?.sortBy || 'title';
    const order = context.req.query?.order || 'ASC';

    try {
        const events = await models.event.findAll({
            where: {
                host: context?.user.id,
                ...(context.req.query?.date && { date: context.req.query?.date }),
                ...(context.req.query?.title && { title: { [Op.iLike]: `%${context.req.query?.title}%` } }),
            },
            order: [[sortBy, order]],
            limit,
            offset: (page - 1) * limit,
            include: [
                {
                    model: models.user,
                    as: 'hostedBy',
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: models.user,
                    as: 'attendees',
                    through: {
                        attributes: [],
                    },
                    attributes: ['id', 'name', 'email'],
                },
            ],
            attributes: ['id', 'title', 'location', 'date'],
        });
        return events;
    } catch (error) {
        return error;
    }
}

async function getEvent(_, args, context) {
    const { eventId } = args;
    const { models } = context;
    try {
        const event = await models.event.findByPk(eventId, {
            include: [
                {
                    model: models.user,
                    as: 'hostedBy',
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: models.user,
                    as: 'attendees',
                    through: {
                        attributes: [],
                    },
                    attributes: ['id', 'name', 'email'],
                },
            ],
            // attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'host'] },
        });
        console.log(event)
        if (!event) {
            throw new GraphQLError('Event not found');
        }
        return event;
    } catch (error) {
        return error;
    }
}

async function updateEvent(_, args, context) {
    const { eventId } = context.req.query;
    const { models, user } = context;
    try {
        const event = await models.event.findByPk(args.id);
        if (!event) {
            throw new GraphQLError('Event not found');
        }
        if (event.host !== user.id) {
            throw new GraphQLError('Not authorized');
        }
        await models.event.update(args.details, {
            where: {
                id: args.id,
            },
        });
        return 'Event updated';
    } catch (error) {
        return error;
    }
}

async function deleteEvent(_, args, context) {
    const { eventId } = context.req.query;
    const { models, sequelizeInstance, user } = context;
    const transaction = await sequelizeInstance.transaction();
    try {
        const event = await models.event.findByPk(args.id);
        if (!event) {
            throw new GraphQLError('Event not Found');
        }
        if (event.host !== user.id) {
            throw new GraphQLError('Not authorized');
        }

        await models.event.destroy({
            where: {
                id: args.id,
            },
            transaction,
        });

        await models.eventAttendees.destroy({
            where: {
                eventId: args.id,
            },
            transaction,
        });
        await transaction.commit();
        return 'Event deleted!';
    } catch (error) {
        await transaction.rollback();
        return error;
    }
    //paranoid
}

async function inviteUser(_, args, context) {
    const { eventId } = context.req.query;
    const { email } = args;
    const { models, user } = context;
    try {
        const event = await models.event.findByPk(args.id);
        if (!event) {
            throw new GraphQLError('Event not found');
        }
        if (event.host !== user.id) {
            throw new GraphQLError('Not authorized');
        }
        const findUser = await models.user.findOne({ where: { email: { [Op.iLike]: `%${email}%` } } });
        if (!findUser) {
            throw new GraphQLError('User not found');
        }

        const findAttendee = await models.eventAttendees.findOne({
            where: {
                attendee: findUser.email,
            },
        });

        if (findAttendee) {
            throw new GraphQLError('User already invited');
        }

        await models.eventAttendees.create({
            eventId: args.id,

            attendee: findUser.email,
            userEmail: findUser.email

        });

        return 'User invited';
    } catch (error) {
        return error;
    }
}

async function getInvites(_, args, context) {
    const { models, user } = context;
    try {
        const invites = await models.eventAttendees.findAll({
            where: {
                attendee: user.email,
            },
            include: [{
                model: models.event,
                as: 'event',
                include: [{
                    model: models.user,
                    as: 'hostedBy',
                    attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] },
                }, {
                    model: models.user,
                    as: 'attendees',
                    through: {
                        attributes: [],
                    },
                    attributes: ['id', 'name', 'email'],
                }],
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'host'] },
            }],
            attributes: { exclude: ['eventId', 'attendee', 'createdAt', 'updatedAt', 'deletedAt'] },
        });
        return invites;
    } catch (error) {
        return error;
    }
}

module.exports = {
    Query: {
        getEvents,
        getEvent,
        getInvites,
    },
    Mutation: {
        createEvent,
        updateEvent,
        deleteEvent,
        inviteUser,
    },
};
