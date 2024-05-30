const Notification = require('../Models/notification.model');
const Bid = require('../Models/bid.model');

const notifyBidders = async (itemId, message) => {
    try {
        const bids = await Bid.findAll({ where: { itemId }, attributes: ['userId'] });
        const userIds = [...new Set(bids.map(bid => bid.userId))];

        userIds.forEach(async (userId) => {
            await Notification.create({ userId, message });
        });
    } catch (error) {
        console.error('Error notifying bidders', error);
    }
};

module.exports = { notifyBidders };
