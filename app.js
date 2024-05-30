const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./Config/db');
const authRoutes = require('./routes/auth.routes');
const itemRoutes = require('./routes/items.routes');
const bidRoutes = require('./routes/bids.routes');
const notificationRoutes = require('./routes/noification.Routes');
const errorHandler = require('./Middlewares/errorHandler');
const initBidSocket = require('./sockets/bidSocket');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/users', authRoutes);
app.use('/items', itemRoutes);
app.use('/items', bidRoutes);
app.use('/notifications', notificationRoutes);

// Error handling
app.use(errorHandler);

// Initialize WebSocket
initBidSocket(io);

// Sync database and start server
sequelize.sync().then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});
