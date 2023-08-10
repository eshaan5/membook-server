import bcrypt from 'bcrypt'; // for password encryption
import jwt from 'jsonwebtoken'; // for generating token - store user in browser for sometime

import User from '../models/user.js';

// signin
export const signin = async (req, res) => {
    const { email, password } = req.body; // getting email and password from the frontend

    try {
        const existingUser = await User.findOne({ email });

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist!" }); // if user doesn't exist

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password); // comparing password with the password in the database

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid password!" }); // if password is incorrect

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" }); // creating token - test is the secret key

        res.status(200).json({ result: existingUser, token }); // sending the user and token
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

// signup
export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body; // getting email, password, confirmPassword, firstName, lastName from the frontend

    try {
        const existingUser = await User.findOne({ email }); // checking if the user already exists

        if(existingUser) return res.status(400).json({ message: "User already exists!" }); // if user already exists

        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match!" }); // if password and confirmPassword don't match

        const hashedPassword = await bcrypt.hash(password, 12); // 12 is the salt - more the salt, more secure the password, usually 12 is used

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` }); // creating the user

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" }); // creating token - test is the secret key

        res.status(200).json({ result, token }); // sending the user and token
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}