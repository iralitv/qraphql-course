const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require("../../models/user");
const Booking = require("../../models/booking");

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

const singleEvent = async eventId => {
   try {
       const event = await Event.findById(eventId);
       return { 
           ...event._doc, 
           _id: event.id, 
           creator: user.bind(this, event.creator)
        };
   } catch (error) {
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
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return { 
                    ...booking._doc, 
                    _id: booking.id, 
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString() 
                };
            });
        } catch (error) {
            throw error;
        }
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
    },
    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const booking = new Booking({
                user: '6048604aa92f0b11f8731be0',
                event: fetchedEvent
            });
            const result = await booking.save();
            return { 
                ...result._doc, 
                _id: result.id, 
                user: user.bind(this, result._doc.user),
                event: singleEvent.bind(this, result._doc.event),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()  
            };
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = { 
                ...booking.event._doc, 
                _id: booking.event._doc.id, 
                creator: user.bind(this, booking.event._doc.creator) 
            };
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (error) {
            throw error;
        }
    }
}