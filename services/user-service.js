import { User } from "../models/user-model.js"
import { Registration } from "../models/registration-model.js";
import { HttpError } from "../utils/services/http-error.js";
import { compareHash, hashPassword } from "../utils/services/password-hash.js";
import { generateToken } from "../utils/services/token.js";
import axios from "axios";

export const signup = async (user) => {
    try {
        const existingUser = await User.findOne({ email: user.email });
        
        if(existingUser){
            throw new HttpError('User already exists', 409);
        }

        user.password = hashPassword(user.password);
        const newUser = await User.create(user);

        if(newUser && newUser._id){
            return {
                token: generateToken(newUser.email),
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            }
        }
    } catch (err) {
        throw err;
    }
}

export const login = async (user) => {
    try {
        const existingUser = await User.findOne({ email: user.email });
        
        if(!existingUser){
            throw new HttpError('User not found', 404);
        }

        if(!existingUser.password || !compareHash(user.password, existingUser.password)){
            throw new HttpError('Invalid credentials', 401);
        }

        return {
            token: generateToken(existingUser.email),
            user: {
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        }
    } catch (err) {
        throw err;
    }
}

export const googleLoginUser = async (token) => {
    try {

        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { email } = res.data;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name: email.split('@')[0],
                email
            });
            await user.save({ validateBeforeSave: false });
        }

        return {
            token: generateToken(user.email),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    } catch (err) {
        throw err;
    }
};

export const getAllUsers = async () => {
    try {
        const users = await User.find({ role: { $ne : 'admin' }}).select('-password');

        const result = await Promise.all(
            users.map(async (user) => {
                const registrations = await Registration.find({ student: user._id });

                const eventsRegistered = registrations.length;

                const eventsAttended = registrations.filter(
                    (r) => r.attendanceMarked
                ).length;

                return {
                    ...user.toObject(),
                    eventsRegistered,
                    eventsAttended,
                };
            })
        );

        return result;
    } catch (err) {
        throw err;
    }
}

export const registerUser = async (registration) => {
    try {
        const registered = await Registration.create(registration);
        if(registered && registered._id){
            return { message: "Successfully registered for event" }
        }
    } catch (err) {
        throw err;
    }
}

export const getUserCertificates = async (userId) => {
    try {
        const certificates = await Registration.find({ student: userId, attendanceMarked: true }).populate('event');
        return certificates;
    } catch (err) {
        throw err;
    }
}

export const getAllUserEvents = async (userId) => {
    try {
        const registrations = await Registration.find({ student: userId }).populate('event');
        const events = registrations.map(reg => {
            const event = reg.event.toObject();
            event.feedback = reg.feedback;
            event.attendanceMarked = reg.attendanceMarked;
            return event;
        });
        return events;
    } catch (err) {
        throw err;
    }
}

export const addUserFeedback = async (feedback) => {
    try {
        const { userId, eventId, rating, message } = feedback;

        const registration = await Registration.findOne({ student: userId, event: eventId });

        if (!registration) {
            throw new HttpError("Registration not found for this user and event", 404);
        }

        if (!registration.attendanceMarked) {
            throw new HttpError("Feedback can only be given after attending the event", 400);
        }

        if (registration.feedback && registration.feedback.rating && registration.feedback.comment) {
            throw new HttpError("Feedback already submitted for this event", 409);
        }

        registration.feedback = {
            rating,
            comment: message,
            submittedAt: new Date()
        };

        await registration.save();

        return { message: "Feedback submitted successfully" };
    } catch (err) {
        throw err;
    }
};

export const getUserFeedback = async (userId) => {
    try {
        const registrations = await Registration.find({
            student: userId,
            'feedback.rating': { $exists: true }
        }).populate('event');

        const feedbacks = registrations.map(reg => ({
            _id: reg._id,
            event: reg.event,
            feedback: reg.feedback
        }));

        return feedbacks;
    } catch (err) {
        throw err;
    }
}