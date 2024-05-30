const express = require('express');
const { getBids, placeBid } = require('../Controllers/bid.controller');
const authenticateToken = require('../Middlewares/auth');

const router = express.Router();

router.get('/:itemId/bids', getBids);
router.post('/:itemId/bids', authenticateToken, placeBid);

module.exports = router;
