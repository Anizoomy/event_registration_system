const express = require('express');
const router = express.Router();
const { secure } = require('../middleware/authMiddleware');

const { registerForEvent, getMyRegistrations, cancelRegistration } = require('../controllers/registrationController');

router.post('/register-event', secure, registerForEvent);
router.get('/my-registrations', secure, getMyRegistrations);
router.delete('/cancel-registration/:id', secure, cancelRegistration);



module.exports = router;