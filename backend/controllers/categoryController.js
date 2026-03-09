const Category = require('../models/Category');

// 获取品类列表
exports.getCategories = async (req, res) => {
  console.log('收到的查询参数:', req.query);
  try {
    const {
      categoryName,
      cooperativeName,
      demoLevel,
      qualityCert,
      hasFinancialData,
      status,
      season,
      sortBy = 'default',
      page = 1,
      limit = 12
    } = req.query;

    // 先更新一次状态（确保最新）
    await Category.updateStatusBySeason().catch(err => console.log('更新状态失败:', err));

    const filters = {
      categoryName,
      cooperativeName,
      demoLevel,
      qualityCert,
      hasFinancialData: hasFinancialData === 'true',
      status: status !== undefined ? parseInt(status) : undefined,
      season
    };

    const offset = (page - 1) * limit;
    
    const categories = await Category.findAll(filters, sortBy, parseInt(limit), parseInt(offset));
    const total = await Category.count(filters);
    
    // 格式化返回数据，添加新字段
    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      season: cat.season,
      description: cat.description,
      imageUrl: cat.image_url,
      // 新增字段
      category_id: cat.category_id,
      origin_id: cat.origin_id,
      specifications: cat.specifications ? JSON.parse(cat.specifications) : null,
      stock: cat.stock || 0,
      shipping_origin: cat.shipping_origin || '上海',
      freshness_info: cat.freshness_info || '建议冷藏保存，尽快食用',
      shipping_time: cat.shipping_time || cat.season || '全年',
      status: cat.current_status ?? cat.status ?? 1,  // 优先用实时状态，没有就用数据库状态，默认1
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
      // 新增字段
      category_id: category.category_id,
      origin_id: category.origin_id,
      specifications: category.specifications ? JSON.parse(category.specifications) : null,
      stock: category.stock || 0,
      shipping_origin: category.shipping_origin || '上海',
      freshness_info: category.freshness_info || '建议冷藏保存，尽快食用',
      shipping_time: category.shipping_time || category.season || '全年',
      status: category.status ?? 1,
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
    
    res.json({
      code: 0,
      data: stats,
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

// 无限滚动获取品类列表
exports.scrollCategories = async (req, res) => {
  try {
    const {
      categoryName,
      cooperativeName,
      demoLevel,
      qualityCert,
      hasFinancialData,
      season,
      sortBy = 'default',
      limit = 12,
      lastId
    } = req.query;

    const filters = {
      categoryName,
      cooperativeName,
      demoLevel,
      qualityCert,
      hasFinancialData: hasFinancialData === 'true',
      season
    };

    const result = await Category.scroll(filters, sortBy, parseInt(limit), lastId);
    
    // 格式化返回数据
    const formattedCategories = result.items.map(cat => ({
      id: cat.id,
      name: cat.name,
      season: cat.season,
      description: cat.description,
      imageUrl: cat.image_url,
      category_id: cat.category_id,
      origin_id: cat.origin_id,
      specifications: cat.specifications ? JSON.parse(cat.specifications) : null,
      stock: cat.stock || 0,
      shipping_origin: cat.shipping_origin || '上海',
      freshness_info: cat.freshness_info || '建议冷藏保存，尽快食用',
      shipping_time: cat.shipping_time || cat.season || '全年',
      status: cat.status ?? 1,
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
        hasMore: result.hasMore,
        lastId: result.lastId
      },
      message: 'success'
    });
  } catch (error) {
    console.error('获取无限滚动列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 定时更新商品状态（每天凌晨1点执行）
const scheduleStatusUpdate = () => {
  // 计算到明天凌晨1点的时间
  const now = new Date();
  const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // 明天
    1, // 凌晨1点
    0,
    0
  );
  const msToMidnight = night.getTime() - now.getTime();
  
  // 第一次执行：等到明天凌晨1点
  setTimeout(() => {
    // 立即执行一次
    Category.updateStatusBySeason().catch(console.error);
    
    // 然后每天执行一次
    setInterval(async () => {
      try {
        await Category.updateStatusBySeason();
        console.log('商品状态已更新');
      } catch (error) {
        console.error('更新商品状态失败:', error);
      }
    }, 24 * 60 * 60 * 1000); // 24小时
  }, msToMidnight);
  
  console.log(`定时任务已设置，将在 ${night.toLocaleString()} 首次执行`);
};

// 启动定时任务
scheduleStatusUpdate();