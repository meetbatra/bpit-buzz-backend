import bcrypt from 'bcrypt'

export const hashPassword = (password) => {
    return bcrypt.hashSync(password, parseInt(process.env.SALT));
}

export const compareHash = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}