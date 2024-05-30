const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');
const User = require('./user.model');
const Item = require('./item.model');

const Bid = sequelize.define('Bid', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    bidAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

Bid.belongsTo(User, { foreignKey: 'userId' });
Bid.belongsTo(Item, { foreignKey: 'itemId' });

module.exports = Bid;
