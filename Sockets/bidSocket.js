const socketIo = require('socket.io');
const Item = require('../Models/item.model');
const Bid = require('../Models/bid.model');
const NotificationService = require('../Servies/notificationService');

const initBidSocket = (server) => {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('joinRoom', (room) => {
            socket.join(room);
        });

        socket.on('bid', async ({ itemId, userId, bidAmount }) => {
            try {
                const item = await Item.findByPk(itemId);
                if (!item || item.endTime < new Date()) {
                    return socket.emit('error', { message: 'Invalid bid' });
                }

                const bid = await Bid.create({ itemId, userId, bidAmount });
                await item.update({ currentPrice: bidAmount });

                io.to(itemId).emit('update', { item, bid });

                NotificationService.notifyBidders(itemId, `New bid of ${bidAmount} placed on item ${item.name}`);
            } catch (error) {
                socket.emit('error', { message: 'Error placing bid' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

module.exports = initBidSocket;
