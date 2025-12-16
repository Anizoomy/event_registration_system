const express = require('express');
const router = express.Router();
const { secure, adminOnly } = require('../middleware/authMiddleware')
const { createEvent, getEventById, getAllEvents, deleteEvent } = require('../controllers/eventController');

router.post('/events', secure, adminOnly, createEvent);
router.get('/event/:id', getEventById);
router.get('/events', getAllEvents);
router.delete('/event/:id', secure, adminOnly, deleteEvent);



module.exports = router;