// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');
const eventController = require('../controller/eventController');
const authentication = require('../middleware/authentication');
const { createEventValidators, updateEventvalidators } = require('../middleware/validators');

const router = express.Router();

router.post('/create', createEventValidators, authentication, eventController.createEvent);
router.get('/get', authentication, eventController.getEvents);
router.get('/getEvent/:eventId', authentication, eventController.getEvent);
router.post('/invite/:eventId', authentication, eventController.inviteUser);
router.get('/get-invites', authentication, eventController.getInvites);
router.put('/update/:eventId', authentication, eventController.updateEvent);


module.exports = router;    
