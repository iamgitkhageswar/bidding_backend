const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user.model');
require('dotenv').config();

const register = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, email });
        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: 'Error logging in', error });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json({ user });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching profile', error });
    }
};

module.exports = { register, login, getProfile };
