import { User } from "../../models/user-model.js";
import { verifyToken } from "../services/token.js";

export const verifyAdmin = async (req,res,next) => {
    const token = req.headers['authorization'];
    if(!token){
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const email = verifyToken(token);
        const user = await User.findOne({ email });

        if(!user){
            return res.status(401).json({ message: 'Invalid token user' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export const checkToken = async (req,res,next) => {
    const token = req.headers['authorization'];
    if(!token){
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const email = verifyToken(token);
        const user = await User.findOne({ email });

        if(!user){
            return res.status(401).json({ message: 'Invalid token user' });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}