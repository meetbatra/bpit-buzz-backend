import fs from 'fs';
import path from 'path';
import { addNewEvent, getAllEvents, getRegisteredEventUsers, markUserAttendance } from '../services/event-service.js';

export const addEvent = async (req,res) => {
    const posterFile = req.files.poster || req.files['poster[]'];
    try {
        if(!posterFile){
            return res.status(400).json({
                message: "Poster missing"
            });
        }

        const filename = req.body.title + '.jpg';
        const data = posterFile.data;
        const uploadPath = path.join(process.cwd(), 'upload', filename);
        fs.writeFileSync(uploadPath, data);
        const result = await addNewEvent(req.body);
        return res.status(200).json(result);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving poster' });
    }
}

export const getEvents = async (req,res) => {
    try {
        const events = await getAllEvents();
        res.status(200).json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error sending events' });
    }
}

export const getRegisteredUsers = async (req,res) => {
    const { event } = req.body;
    try {
        const users = await getRegisteredEventUsers(event);
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetch registered users' });
    }
}

export const markAttendance = async (req,res) => {
    try {
        const message = await markUserAttendance(req.body);
        res.status(200).json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error marking attendance' });
    }
}