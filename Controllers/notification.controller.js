const Notification = require('../Models/notification.model');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
        res.json({ notifications });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching notifications', error });
    }
};

const markRead = async (req, res) => {
    try {
        const notifications = await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
        res.json({ message: 'Notifications marked as read' });
    } catch (error) {
        res.status(400).json({ message: 'Error marking notifications as read', error });
    }
};

module.exports = { getNotifications, markRead };
