const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories - 获取品类列表
router.get('/', categoryController.getCategories);

// 无限滚动接口（用于首页推荐）
// GET /api/categories/scroll?limit=12
// GET /api/categories/scroll?limit=12&lastId=xxx
router.get('/scroll', categoryController.scrollCategories);

// GET /api/categories/stats - 获取统计数据
router.get('/stats', categoryController.getStats);

// GET /api/categories/:id - 获取品类详情
router.get('/:id', categoryController.getCategoryDetail);

module.exports = router;