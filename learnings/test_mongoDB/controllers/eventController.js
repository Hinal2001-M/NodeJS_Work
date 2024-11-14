const{ validationResult } = require('express-validator');
const Event = require('../models/event');
const User = require('../models/user');

function checkValidationErrors(req){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Failed!!!');
        error.status = 422;
        error.data = errors.array();
        throw error;
    }
}

module.exports.createEvent = async(req,res)=>{
    const{title,description,date,location} = req.body;
    const userId = req.user.id;
    
    try{
        checkValidationErrors(req);

        const newEvent = await Event.create({
            title,
            description,
            date,
            location,
            createdBy: userId
        });
        res.status(201).json({ newEvent });
    }catch(error){
        res.status(error.status || 500).json({
            name: error.name,
            message: error.message,
            data: error.data,
        });
    };
    
};

module.exports.getEvents = async (req,res)=> {
    const page = req.query.page || 1;
    const limit = req.query.limit ||10;
    const skip = (page - 1)*limit;
    const sortBy = req.query.sortBy ||'date';
    const order = req.query.order || 'asc';
    const query = {};

    if (req.query.length > 0){
        query.date = {$eq: req.query.date};
        query.location = req.query.location;
        query.title = {$regex: req.query.title, $options: 'i'};
        query.description = req.query.description;
    }
    

    try{
        checkValidationErrors(req);

        const event = await Event.find({
            $and:[
                { createdBy: req.user.id},
                query,
            ]
        })

        .populate('createdBy', 'name email')
        .populate('attendees', 'name email')
        .select('-__v')
        .sort({[sortBy]: order})
        .skip(skip)
        .limit(limit)
        .exec();
        
        res.status(200).json({event});

    }catch(error){
        res.status(error.status || 500).json({
            name: error.name,
            message: error.message,
            data: error.data,
        });   
    };
};

function eventNotFound(event) {
    if(!event){
        const error = new Error('event not found');
        error.status = 404;
        throw error;
    };
};

module.exports.getEvent = async(req,res)=>{
    const { eventId } = req.params;

    try{
        checkValidationErrors(req);

        const event = await Event.findById(eventId)
        .populate('createdBy', 'name email')
        .populate('attendees', 'name email')
        .select('-__v')
        .exec();

        eventNotFound(event);

        res.status(200).json({event});
        
    }catch(error){
        res.status(error.status || 500).json({
            name: error.name,
            message: error.message,
            data: error.data,
        });
    };
};

function checkAuthorization(event,req){
    if(event.createdBy.toString() !== req.user.id){
        const error = new Error('not authorized!!!');
        error.status = 401;
        throw error;
    };
};

module.exports.updateEvent = async(req,res)=>{
    const { eventId } = req.params;

    const newData = {};   
  
    try {
      const event = await Event.findOne({
        $and: [
          { createdBy: req.user.id },
          { _id: eventId },
        ],
      });
      if (!event) {
        const error = new Error('Not updated');
        throw error;
      }
  
      await Event.updateOne({ _id: event._id }, req.body);
      return res.status(200).json({
        message: 'Event updated successfully',
      });
    } catch (error) {
        res.status(error.status || 500).json({
            name: error.name,
            message: error.message,
            data: error.data,
        });
    }
}

module.exports.deleteEvent = async(req,res)=>{
    const { eventId } = req.params;

    try{
        checkValidationErrors(req);

        const event = await Event.findById(eventId)
        eventNotFound(event);

        checkAuthorization(event,req);

        await event.deleteOne({ _id: eventId})
        res.status(200).json({
            message: 'event deleted successfully'
        });
    }catch(error){
        res.status(error.status || 500).json({
            name: error.name,
            message: error.message,
            data: error.data,
        });
    };
};

module.exports.inviteUser = async(req,res)=>{
    const { eventId } = req.params;
    const { email } = req.body;

    try{
        checkValidationErrors(req);

        const event = await Event.findById({_id: eventId})
        eventNotFound(event);

        checkAuthorization(event,req);

        const users = await User.findOne({email});
    if (!users) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    if (event.attendees.includes(users._id)) {
        const error = new Error('User already invited');
        error.status = 422;
        throw error;
    }
    if(event.createdBy === users._id){
        throw new Error('you cannot invite yourself');
    }

    event.attendees.push(users._id);
    await event.save();
    res.status(200).json({
        message: 'User invited',
    });
    
    }catch(error){
        res.status(error.status || 500).json({
            name: error.name,
            message: error.message,
            data: error.data,
        });
    };
};

module.exports.getInvites = async(req,res)=>{
    try {
        checkValidationErrors(req);
    
        const events = await Event.find({ attendees: req.user.id })
          .populate('createdBy', 'name email')
          .populate('attendees', 'name email')
          .select('-__v')
          .exec();
    
        res.status(200).json({ events });
    }catch (error) {
        res.status(error.status || 500).json({
          name: error.name,
          message: error.message,
          data: error.data,
        });
    };
}