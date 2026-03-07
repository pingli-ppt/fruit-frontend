const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories - 获取品类列表
router.get('/', categoryController.getCategories);

// GET /api/categories/stats - 获取统计数据
router.get('/stats', categoryController.getStats);

// GET /api/categories/:id - 获取品类详情
router.get('/:id', categoryController.getCategoryDetail);

module.exports = router;