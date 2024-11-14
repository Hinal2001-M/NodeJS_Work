const express = require('express');
const eventController = require('../controllers/eventController');
const authentication = require('../middleware/authentication');
const validators = require('../middleware/validators');

const router = express.Router();

router.post('/createEvent', validators.createEventValidator, authentication,eventController.createEvent);
router.get('/getEvents', authentication, eventController.getEvents);
router.get('/getEvent/:eventId', authentication, eventController.getEvent);
router.put('/updateEvent/:eventId', authentication, eventController.updateEvent);
router.delete('/deleteEvent/:eventId', authentication, eventController.deleteEvent);
router.post('/inviteUser/:eventId', authentication, eventController.inviteUser);
router.get('/getInvite', authentication, eventController.getInvites);




module.exports = router; 