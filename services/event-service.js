import { Event } from '../models/event-model.js';
import { Registration } from '../models/registration-model.js';
import { HttpError } from "../utils/services/http-error.js";

export const addNewEvent = async (event) => {
    try {
        const eventObj = await Event.create(event);

        if(eventObj && eventObj._id){
            return { message: "Event added successfully" }
        }
    } catch (err) {
        throw err;
    }
}

export const getAllEvents = async () => {
    try {
        const events = await Event.find();
        return events;
    } catch (err) {
        throw err;
    }
}

export const getRegisteredEventUsers = async (eventId) => {
    try {
        const event = await Event.findById(eventId);
        const users = await Registration.find({ event: eventId }).populate("student", "name email").populate("event", "title");
        return { title: event.title, users };
    } catch (err) {
        throw err;
    }
}

export const markUserAttendance = async (data) => {
    try {
        const updated = await Registration.findOneAndUpdate(
            { event: data.event, student: data.student },
            { $set: { attendanceMarked: true } },
            { new: true } 
        )

        if(!updated) {
            throw new HttpError("User not found", 404);
        }

        return {
            message: "Attendance updated"
        }
    } catch (err) {
        throw err;
    }
}

export const getFeedbacks = async (eventId) => {
    try {
        const registrations = await Registration.find({
            event: eventId,
            'feedback.rating': { $exists: true }
        }).populate('student');

        const event = await Event.findById(eventId);

        const feedbacks = registrations.map(reg => ({
            _id: reg._id,
            student: reg.student,
            feedback: reg.feedback
        }));

        return { title: event.title, feedbacks };
    } catch (err) {
        throw err;
    }
}