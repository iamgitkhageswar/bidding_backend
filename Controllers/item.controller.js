const Item = require('../Models/item.model');
const { Op } = require('sequelize');

const getItems = async (req, res) => {
    const { page = 1, limit = 10, search = '', status } = req.query;
    const offset = (page - 1) * limit;
    const where = {
        name: { [Op.iLike]: `%${search}%` },
    };
    if (status === 'active') {
        where.endTime = { [Op.gt]: new Date() };
    } else if (status === 'ended') {
        where.endTime = { [Op.lt]: new Date() };
    }

    try {
        const items = await Item.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });
        res.json({ items });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching items', error });
    }
};

const getItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ item });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching item', error });
    }
};

const createItem = async (req, res) => {
    const { name, description, startingPrice, endTime } = req.body;
    try {
        const item = await Item.create({
            name,
            description,
            startingPrice,
            currentPrice: startingPrice,
            imageUrl: req.file?.path,
            endTime,
        });
        res.status(201).json({ item });
    } catch (error) {
        res.status(400).json({ message: 'Error creating item', error });
    }
};

const updateItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        const { name, description, startingPrice, endTime } = req.body;
        await item.update({
            name,
            description,
            startingPrice,
            endTime,
            imageUrl: req.file?.path || item.imageUrl,
        });
        res.json({ item });
    } catch (error) {
        res.status(400).json({ message: 'Error updating item', error });
    }
};

const deleteItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await item.destroy();
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting item', error });
    }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
