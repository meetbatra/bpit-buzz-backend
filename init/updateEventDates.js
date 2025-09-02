import mongoose from "mongoose";
import dotenv from "dotenv";
import { Event } from "../models/event-model.js";

dotenv.config();

const updateEventDates = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to database');

        // Get all events
        const events = await Event.find({});
        console.log(`Found ${events.length} events`);

        if (events.length === 0) {
            console.log('No events found in database');
            return;
        }

        // Current date: September 2, 2025
        const today = new Date('2025-09-02');
        
        // Define future dates (distinct days)
        const futureDates = [
            new Date('2025-09-05'), // September 5, 2025
            new Date('2025-09-08'), // September 8, 2025
            new Date('2025-09-12'), // September 12, 2025
            new Date('2025-09-15'), // September 15, 2025
            new Date('2025-09-18'), // September 18, 2025
        ];

        // Update first 3 events to today
        const eventsToUpdateToday = events.slice(0, 3);
        for (let i = 0; i < eventsToUpdateToday.length; i++) {
            const event = eventsToUpdateToday[i];
            await Event.findByIdAndUpdate(event._id, { date: today });
            console.log(`Updated event "${event.title}" to today (${today.toISOString().split('T')[0]})`);
        }

        // Update remaining events to future dates
        const remainingEvents = events.slice(3);
        for (let i = 0; i < remainingEvents.length; i++) {
            const event = remainingEvents[i];
            const futureDate = futureDates[i % futureDates.length];
            await Event.findByIdAndUpdate(event._id, { date: futureDate });
            console.log(`Updated event "${event.title}" to ${futureDate.toISOString().split('T')[0]}`);
        }

        console.log('Successfully updated all event dates');
        
        // Display updated events
        const updatedEvents = await Event.find({}).sort({ date: 1 });
        console.log('\nUpdated events:');
        updatedEvents.forEach(event => {
            console.log(`- ${event.title}: ${event.date.toISOString().split('T')[0]} at ${event.time}`);
        });

    } catch (error) {
        console.error('Error updating event dates:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed');
    }
};

updateEventDates();
