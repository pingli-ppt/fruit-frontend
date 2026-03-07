const db = require('../config/database');

class Category {
  // 获取所有品类（支持筛选、排序、分页）
  static async findAll(filters = {}, sortBy = 'default', limit = 12, offset = 0) {
    let sql = `
      SELECT c.*, 
             coop.name as cooperative_name, 
             coop.level as cooperative_level, 
             coop.quality as cooperative_quality,
             s.planting_area as stats_planting_area,
             s.annual_output as stats_annual_output,
             s.annual_sales as stats_annual_sales,
             s.annual_revenue as stats_annual_revenue,
             s.price_per_ton as stats_price_per_ton,
             c.category_id,
             c.origin_id,
             c.specifications,
             c.stock,
             c.shipping_origin,
             c.freshness_info,
             c.shipping_time,
             c.status
      FROM categories c
      LEFT JOIN cooperatives coop ON c.cooperative_id = coop.id
      LEFT JOIN sales_stats s ON c.id = s.category_id
      WHERE 1=1
    `;
    
    const params = [];
    
    // 添加筛选条件
    if (filters.categoryName) {
      sql += ' AND c.name LIKE ?';
      params.push(`%${filters.categoryName}%`);
    }
    
    if (filters.cooperativeName) {
      sql += ' AND coop.name LIKE ?';
      params.push(`%${filters.cooperativeName}%`);
    }
    
    if (filters.demoLevel) {
      sql += ' AND coop.level = ?';
      params.push(filters.demoLevel);
    }
    
    if (filters.qualityCert) {
      sql += ' AND coop.quality = ?';
      params.push(filters.qualityCert);
    }
    
    if (filters.hasFinancialData) {
      sql += ' AND s.annual_sales > 0';
    }
    
    // 排序
    switch (sortBy) {
      case 'sales':
        sql += ' ORDER BY s.annual_sales DESC';
        break;
      case 'revenue':
        sql += ' ORDER BY s.annual_revenue DESC';
        break;
      case 'price':
        sql += ' ORDER BY s.price_per_ton DESC';
        break;
      case 'name':
        sql += ' ORDER BY c.name';
        break;
      default:
        sql += ' ORDER BY c.created_at DESC';
    }
    
    // 分页
    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    
    const [rows] = await db.query(sql, params);
    return rows;
  }

  // 获取总数
  static async count(filters = {}) {
    let sql = `
      SELECT COUNT(*) as total 
      FROM categories c
      LEFT JOIN cooperatives coop ON c.cooperative_id = coop.id
      LEFT JOIN sales_stats s ON c.id = s.category_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.categoryName) {
      sql += ' AND c.name LIKE ?';
      params.push(`%${filters.categoryName}%`);
    }
    
    if (filters.cooperativeName) {
      sql += ' AND coop.name LIKE ?';
      params.push(`%${filters.cooperativeName}%`);
    }
    
    if (filters.demoLevel) {
      sql += ' AND coop.level = ?';
      params.push(filters.demoLevel);
    }
    
    if (filters.qualityCert) {
      sql += ' AND coop.quality = ?';
      params.push(filters.qualityCert);
    }
    
    if (filters.hasFinancialData) {
      sql += ' AND s.annual_sales > 0';
    }
    
    const [rows] = await db.query(sql, params);
    return rows[0].total;
  }

  // 根据ID查找品类
  static async findById(id) {
    const [rows] = await db.query(`
      SELECT c.*, 
             coop.name as cooperative_name, 
             coop.level as cooperative_level, 
             coop.quality as cooperative_quality,
             coop.contact as cooperative_contact,
             coop.phone as cooperative_phone,
             coop.planting_area as cooperative_planting_area,
             s.planting_area as stats_planting_area,
             s.annual_output as stats_annual_output,
             s.annual_sales as stats_annual_sales,
             s.annual_revenue as stats_annual_revenue,
             s.price_per_ton as stats_price_per_ton,
             c.category_id,
             c.origin_id,
             c.specifications,
             c.stock,
             c.shipping_origin,
             c.freshness_info,
             c.shipping_time,
             c.status
      FROM categories c
      LEFT JOIN cooperatives coop ON c.cooperative_id = coop.id
      LEFT JOIN sales_stats s ON c.id = s.category_id
      WHERE c.id = ?
    `, [id]);
    
    return rows[0];
  }

  // 获取统计数据
  static async getStats() {
    try {
      console.log('Category.getStats 开始执行...');
    
      // 查询总品类数
      const [total] = await db.query('SELECT COUNT(*) as total FROM categories');
      console.log('总品类数查询结果:', total);
    
      // 查询有销售数据的品类数
      const [withFinancial] = await db.query(`
        SELECT COUNT(DISTINCT c.id) as total 
        FROM categories c
        INNER JOIN sales_stats s ON c.id = s.category_id
        WHERE s.annual_sales > 0
      `);
      console.log('有销售数据查询结果:', withFinancial);
    
      // 查询示范合作社数量
      const [demoCoops] = await db.query(`
        SELECT COUNT(*) as total 
        FROM cooperatives 
        WHERE level IS NOT NULL 
          AND level != '' 
          AND level != '否'
      `);
      console.log('示范合作社查询结果:', demoCoops);
    
      // 查询合作社总数
      const [totalCoops] = await db.query('SELECT COUNT(*) as total FROM cooperatives');
      console.log('合作社总数查询结果:', totalCoops);
    
      const result = {
        totalCategories: total[0]?.total || 0,
        withFinancialData: withFinancial[0]?.total || 0,
        demoCooperatives: demoCoops[0]?.total || 0,
        totalCooperatives: totalCoops[0]?.total || 0
      };
    
      console.log('统计数据结果:', result);
      return result;
    
    } catch (error) {
      console.error('Category.getStats 错误:', error);
      throw error;
    }
  }

  // 无限滚动获取品类
  static async scroll(filters = {}, sortBy = 'default', limit = 12, lastId = null) {
    let sql = `
      SELECT c.*, 
             coop.name as cooperative_name, 
             coop.level as cooperative_level, 
             coop.quality as cooperative_quality,
             s.planting_area as stats_planting_area,
             s.annual_output as stats_annual_output,
             s.annual_sales as stats_annual_sales,
             s.annual_revenue as stats_annual_revenue,
             s.price_per_ton as stats_price_per_ton,
             c.category_id,
             c.origin_id,
             c.specifications,
             c.stock,
             c.shipping_origin,
             c.freshness_info,
             c.shipping_time,
             c.status
      FROM categories c
      LEFT JOIN cooperatives coop ON c.cooperative_id = coop.id
      LEFT JOIN sales_stats s ON c.id = s.category_id
      WHERE 1=1
    `;
  
    const params = [];
  
    // 添加筛选条件
    if (filters.categoryName) {
      sql += ' AND c.name LIKE ?';
      params.push(`%${filters.categoryName}%`);
    }
  
    if (filters.cooperativeName) {
      sql += ' AND coop.name LIKE ?';
      params.push(`%${filters.cooperativeName}%`);
    }
  
    if (filters.demoLevel) {
      sql += ' AND coop.level = ?';
      params.push(filters.demoLevel);
    }
  
    if (filters.qualityCert) {
      sql += ' AND coop.quality = ?';
      params.push(filters.qualityCert);
    }
  
    if (filters.hasFinancialData) {
      sql += ' AND s.annual_sales > 0';
    }
  
    // 无限滚动：获取比 lastId 更小的数据
    if (lastId) {
      sql += ' AND c.id < ?';
      params.push(lastId);
    }
  
    // 排序
    switch (sortBy) {
      case 'sales':
        sql += ' ORDER BY s.annual_sales DESC, c.id DESC';
        break;
      case 'revenue':
        sql += ' ORDER BY s.annual_revenue DESC, c.id DESC';
        break;
      case 'price':
        sql += ' ORDER BY s.price_per_ton DESC, c.id DESC';
        break;
      case 'name':
        sql += ' ORDER BY c.name, c.id DESC';
        break;
      case 'new':
        sql += ' ORDER BY c.created_at DESC, c.id DESC';
        break;
      default:
        sql += ' ORDER BY c.id DESC';
    }
  
    // 限制数量（多取一条用于判断是否有更多）
    sql += ' LIMIT ?';
    params.push(Number(limit) + 1);
  
    const [rows] = await db.query(sql, params);
  
    // 判断是否有更多数据
    const hasMore = rows.length > limit;
    const data = hasMore ? rows.slice(0, limit) : rows;
    const lastItemId = data.length > 0 ? data[data.length - 1].id : null;
  
    return {
      items: data,
      hasMore,
      lastId: lastItemId
    };
  }
}

module.exports = Category;