const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const cooperativeRoutes = require('./routes/cooperativeRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors()); // 允许跨域
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/categories', categoryRoutes);
app.use('/api/cooperatives', cooperativeRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fruit Backend API',
    endpoints: {
      categories: '/api/categories',
      categoriesStats: '/api/categories/stats',
      categoriesDetail: '/api/categories/:id',
      cooperatives: '/api/cooperatives'
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`API接口:`);
  console.log(`   - 品类列表: http://localhost:${PORT}/api/categories`);
  console.log(`   - 统计数据: http://localhost:${PORT}/api/categories/stats`);
  console.log(`   - 合作社列表: http://localhost:${PORT}/api/cooperatives`);
});