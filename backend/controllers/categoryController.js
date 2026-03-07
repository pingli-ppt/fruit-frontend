const Category = require('../models/Category');

// 获取品类列表（支持筛选、排序、分页）
exports.getCategories = async (req, res) => {
  try {
    const {
      categoryName,
      cooperativeName,
      demoLevel,
      qualityCert,
      hasFinancialData,
      sortBy = 'default',
      page = 1,
      limit = 12
    } = req.query;

    const filters = {
      categoryName,
      cooperativeName,
      demoLevel,
      qualityCert,
      hasFinancialData: hasFinancialData === 'true'
    };

    const offset = (page - 1) * limit;
    
    const categories = await Category.findAll(filters, sortBy, parseInt(limit), parseInt(offset));
    const total = await Category.count(filters);
    
    // 格式化返回数据，与前端期望的格式一致
    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      season: cat.season,
      description: cat.description,
      imageUrl: cat.image_url,
      cooperative: {
        id: cat.cooperative_id,
        name: cat.cooperative_name,
        level: cat.cooperative_level,
        quality: cat.cooperative_quality
      },
      stats: {
        plantingArea: cat.stats_planting_area || 0,
        annualOutput: cat.stats_annual_output || 0,
        annualSales: cat.stats_annual_sales || 0,
        annualRevenue: cat.stats_annual_revenue || 0,
        pricePerTon: cat.stats_price_per_ton || 0
      }
    }));

    res.json({
      code: 0,
      data: {
        categories: formattedCategories,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      },
      message: 'success'
    });
  } catch (error) {
    console.error('获取品类列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 获取品类详情
exports.getCategoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        code: 404,
        message: '品类不存在'
      });
    }

    const formattedCategory = {
      id: category.id,
      name: category.name,
      season: category.season,
      description: category.description,
      imageUrl: category.image_url,
      cooperative: {
        id: category.cooperative_id,
        name: category.cooperative_name,
        level: category.cooperative_level,
        quality: category.cooperative_quality,
        contact: category.cooperative_contact,
        phone: category.cooperative_phone,
        plantingArea: category.cooperative_planting_area
      },
      stats: {
        plantingArea: category.stats_planting_area || 0,
        annualOutput: category.stats_annual_output || 0,
        annualSales: category.stats_annual_sales || 0,
        annualRevenue: category.stats_annual_revenue || 0,
        pricePerTon: category.stats_price_per_ton || 0
      }
    };

    res.json({
      code: 0,
      data: formattedCategory,
      message: 'success'
    });
  } catch (error) {
    console.error('获取品类详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 获取统计数据
exports.getStats = async (req, res) => {
  try {
    console.log('开始获取统计数据...');
    const stats = await Category.getStats();
    console.log('统计数据获取成功:', stats);
    
    // 直接返回 stats 对象
    res.json({
      code: 0,
      data: stats,  // stats 已经是对象 {totalCategories, withFinancialData, demoCooperatives, totalCooperatives}
      message: 'success'
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({
      code: 500,
      message: error.message || '服务器内部错误'
    });
  }
};