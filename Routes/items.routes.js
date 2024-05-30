const express = require('express');
const { getItems, getItem, createItem, updateItem, deleteItem } = require('../Controllers/item.controller');
const authenticateToken = require('../Middlewares/auth');
const authorizeRoles = require('../Middlewares/role');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', authenticateToken, authorizeRoles('user', 'admin'), upload.single('image'), createItem);
router.put('/:id', authenticateToken, authorizeRoles('user', 'admin'), upload.single('image'), updateItem);
router.delete('/:id', authenticateToken, authorizeRoles('user', 'admin'), deleteItem);

module.exports = router;
