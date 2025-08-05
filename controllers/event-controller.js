import fs from 'fs';
import path from 'path';
import { addNewEvent, getAllEvents, getRegisteredEventUsers, markUserAttendance, getFeedbacks as fetchFeedbacks } from '../services/event-service.js';
import { uploadPosterToS3 } from '../utils/services/s3-upload.js';

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
        
        req.body.posterUrl = await uploadPosterToS3(data, filename);

        const result = await addNewEvent(req.body);
        return res.status(200).json(result);
    } catch(err) {
        console.error(err);
        res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
}

export const getEvents = async (req,res) => {
    try {
        const events = await getAllEvents();
        res.status(200).json(events);
    } catch (err) {
        console.error(err);
        res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
}

export const getRegisteredUsers = async (req,res) => {
    const { event } = req.body;
    try {
        const users = await getRegisteredEventUsers(event);
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
}

export const markAttendance = async (req,res) => {
    try {
        const message = await markUserAttendance(req.body);
        res.status(200).json(message);
    } catch (err) {
        console.error(err);
        res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
}

export const getFeedbacks = async (req,res) => {
    const { eventId } = req.body;
    try {
        const feedbacks = await fetchFeedbacks(eventId);
        res.status(200).json(feedbacks);
    } catch (err) {
        console.error(err);
        res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
}