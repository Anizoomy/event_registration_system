const Event = require('../models/eventmodel');

// Create a event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, capacity } = req.body;

        if (!title || !date || !capacity) {
            return res.status(400).json({ 
                message: 'Title, date, and capacity are required'
            });
        }

        const event = new Event({
            title,
            description,
            date,
            location,
            capacity,
            createdBy: req.user._id
        });

        await event.save();

        res.status(201).json({
            message: 'Event created successfully',
            data: event
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({
            message: 'Event fetched successfully',
            data: event
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        })
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('createdBy', 'name email');

        res.status(200).json({
            message: 'Events fetched successfully',
            data: events
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({
            message: 'Event deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
}