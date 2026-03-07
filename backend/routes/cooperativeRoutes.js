const express = require('express');
const router = express.Router();
const cooperativeController = require('../controllers/cooperativeController');

// GET /api/cooperatives - 获取合作社列表
router.get('/', cooperativeController.getCooperatives);

module.exports = router;