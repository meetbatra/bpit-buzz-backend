import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user-model.js";
import { hashPassword } from "../utils/services/password-hash.js";

dotenv.config()

const initAdmin = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);

        await User.create({
            name: 'admin',
            email: 'admin@bpitbuzz.com',
            password: hashPassword(process.env.ADMIN_PASSWORD),
            role: 'admin'
        });

        console.log('Admin created')
    } catch (err) {
        console.log("error creating admin", err);
    }
}

initAdmin();