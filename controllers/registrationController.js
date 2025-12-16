const Registration = require('../models/registermodel');

exports.registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;

        if (!eventId) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        const registration = new Registration({
            event: eventId,
            user: req.user._id
        })

        res.status(201).json({
            message: 'Registered for event successfully',
            data: registration
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        })
    }
};

exports.getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user._id }).populate('event');

        res.status(200).json({
            message: 'Registrations fetched successfully',
            data: registrations
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

exports.cancelRegistration = async (req, res) => {
    try {
        const registration = await Registration.findByIdAndDelete(req.params.id);
       
               if (!registration) {
                   return res.status(404).json({ message: 'Registration not found' });
               }
       
               res.status(200).json({
                   message: 'Registration cancelled successfully'
               })

    } catch (error) {
        res.status(500).json({
            message: 'Server error'
        });
    }
}