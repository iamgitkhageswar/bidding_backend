const express = require('express');
const { getNotifications, markRead } = require('../Controllers/notification.controller');
const authenticateToken = require('../Middlewares/auth');

const router = express.Router();

router.get('/', authenticateToken, getNotifications);
router.post('/mark-read', authenticateToken, markRead);

module.exports = router;
