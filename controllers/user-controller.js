import { signup as signupUser, login as loginUser, getAllUsers, registerUser, getUserCertificates, googleLoginUser } from '../services/user-service.js';

export const signup = async (req,res) => {
    const user = req.body;
    try {
        const resObj = await signupUser(user);
        res.status(200).json(resObj);
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
}

export const login = async (req,res) => {
    const user = req.body;
    try {
        const resObj = await loginUser(user);
        res.status(200).json(resObj);
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
}

export const loginWithGoogle = async (req,res) => {
    const { token } = req.body;
    try {
        const resObj = await googleLoginUser(token);
        res.status(200).json(resObj);
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
}

export const getUsers = async (req,res) => {
    try {
        const resList = await getAllUsers();
        res.status(200).json(resList);
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
}

export const register = async (req,res) => {
    try {
        const message = await registerUser(req.body);
        res.status(200).json(message);
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
}

export const getCertificates = async (req,res) => {
    const { userId } = req.body;
    try {
        const certificates = await getUserCertificates(userId);
        res.status(200).json(certificates);
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
}