import jwt from 'jsonwebtoken';

export const generateToken = (email) => {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
}

export const verifyToken = (token) => {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    return decode.email
}