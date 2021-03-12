const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require("../../models/user");

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return { 
                ...event._doc, 
                _id: event.id, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        })
    }
    catch (err) {
        throw err;
    }
};

const user = async userId => {
    try {
        const userData = await User.findById(userId);
        return { 
            ...userData._doc, 
            id: userData.id,
            createdEvents: events.bind(this, userData._doc.createdEvents)
        };
    }
    catch (err) {
        throw err;
    }
};

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();

            return events.map(event => {
                return { 
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        }
        catch (err) {
            throw err;
        };
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '6048604aa92f0b11f8731be0'
        });
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent = { 
                ...result._doc, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator) 
            };
            const creator = await User.findById('6048604aa92f0b11f8731be0');
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        }
        catch(err) {
            throw err;
        };
    },
    createUser: async args => {
        try {
            const isUserExist = await User.findOne({ email: args.userInput.email });
            if (isUserExist) {
                throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const createdUser = new User({
                email: args.userInput.email,
                password: hashedPassword
            });      
            const user = await createdUser.save();
            return { ...user._doc, password: null, _id: user.id };
        }
        catch(err) {
            throw err;
        };
    }
}