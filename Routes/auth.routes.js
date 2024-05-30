const express = require('express');
const { register, login, getProfile } = require('../Controllers/auth.controller');
const authenticateToken = require('../Middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
