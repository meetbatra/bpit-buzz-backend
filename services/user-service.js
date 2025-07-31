import { User } from "../models/user-model.js"
import { Registration } from "../models/registration-model.js";
import { HttpError } from "../utils/services/http-error.js";
import { compareHash, hashPassword } from "../utils/services/password-hash.js";
import { generateToken } from "../utils/services/token.js";

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

        if(!compareHash(user.password, existingUser.password)){
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
        const certificates = await Registration.find({ student: userId, attendanceMarked: true }).populate('event', 'title date location');
        return certificates;
    } catch (err) {
        throw err;
    }
}