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
    },
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
        },
        submittedAt: {
            type: Date,
        }
    }
});

export const Registration = mongoose.model('Registration', registrationSchema);