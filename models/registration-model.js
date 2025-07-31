import mongoose, { Schema } from 'mongoose';

const registrationSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
    attendanceMarked: {
        type: Boolean,
        default: false,
    }
});

export const Registration = mongoose.model('Registration', registrationSchema);