const Bid = require('../Models/bid.model');
const Item = require('../Models/item.model');
const NotificationService = require('../Servies/notificationService');

const getBids = async (req, res) => {
    try {
        const bids = await Bid.findAll({ where: { itemId: req.params.itemId }, order: [['createdAt', 'DESC']] });
        res.json({ bids });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching bids', error });
    }
};

const placeBid = async (req, res) => {
    const { bidAmount } = req.body;
    try {
        const item = await Item.findByPk(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.endTime < new Date()) return res.status(400).json({ message: 'Auction has ended' });
        if (bidAmount <= item.currentPrice) return res.status(400).json({ message: 'Bid amount must be higher than current price' });

        const bid = await Bid.create({ bidAmount, itemId: req.params.itemId, userId: req.user.id });
        await item.update({ currentPrice: bidAmount });

        // Notify other bidders
        NotificationService.notifyBidders(req.params.itemId, `New bid of ${bidAmount} placed on item ${item.name}`);

        res.status(201).json({ bid });
    } catch (error) {
        res.status(400).json({ message: 'Error placing bid', error });
    }
};

module.exports = { getBids, placeBid };
