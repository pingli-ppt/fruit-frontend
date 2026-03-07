const Cooperative = require('../models/Cooperative');

// 获取合作社列表
exports.getCooperatives = async (req, res) => {
  try {
    const cooperatives = await Cooperative.findAll();
    
    res.json({
      code: 0,
      data: cooperatives,
      message: 'success'
    });
  } catch (error) {
    console.error('获取合作社列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};