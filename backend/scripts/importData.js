const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function importData() {
  let connection;
  try {
    // 检查环境变量
    if (!process.env.DB_PASSWORD) {
      console.error('错误: 请在 .env 文件中设置 DB_PASSWORD');
      console.log('提示: 可以复制 .env.example 为 .env 然后修改密码');
      process.exit(1);
    }

    // 连接数据库
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'fruit_db',
      multipleStatements: true,
      charset: 'utf8mb4'
    });

    console.log('数据库连接成功');
    
    // 读取JSON文件
    const jsonPath = path.join(__dirname, '../../public/data/json/categories-simple.json');
    
    // 检查文件是否存在
    if (!fs.existsSync(jsonPath)) {
      console.error('JSON文件不存在:', jsonPath);
      console.log('请确保文件路径正确：', jsonPath);
      process.exit(1);
    }
    
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    console.log('读取JSON文件成功');
    console.log(`   品类数量: ${jsonData.categories?.length || 0}`);
    console.log(`   合作社数量: ${jsonData.cooperatives?.length || 0}`);
    
    // 开始导入
    console.log('\n开始导入数据...');
    
    // 清空现有数据
    console.log('清空旧数据...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE sales_stats');
    await connection.query('TRUNCATE TABLE categories');
    await connection.query('TRUNCATE TABLE cooperatives');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    // 导入合作社
    console.log('导入合作社...');
    let coopCount = 0;
    for (const coop of jsonData.cooperatives) {
      try {
        await connection.query(
          'INSERT INTO cooperatives (id, name, level, quality, contact, phone, planting_area, has_financial_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            coop.id, 
            coop.name, 
            coop.level || '', 
            coop.quality || '', 
            coop.contact || '', 
            coop.phone || '', 
            coop.plantingArea || 0, 
            coop.hasFinancialData || false
          ]
        );
        coopCount++;
        if (coopCount % 10 === 0) {
          console.log(`  已导入 ${coopCount} 个合作社...`);
        }
      } catch (err) {
        console.error(`导入合作社失败: ${coop.name}`, err.message);
      }
    }
    console.log(`已导入 ${coopCount} 个合作社`);
    
    // 导入品类和销售数据
    console.log('\n导入品类...');
    let catCount = 0;
    let salesCount = 0;
    
    for (const cat of jsonData.categories) {
      try {
        // 插入品类
        await connection.query(
          'INSERT INTO categories (id, name, season, description, image_url, cooperative_id) VALUES (?, ?, ?, ?, ?, ?)',
          [
            cat.id, 
            cat.name || '', 
            cat.season || '', 
            cat.description || '', 
            cat.imageUrl || null, 
            cat.cooperative?.id || null
          ]
        );
        catCount++;
        
        // 如果有销售数据，插入销售数据表
        if (cat.stats && (cat.stats.annualSales > 0 || cat.stats.hasFinancialData)) {
          await connection.query(
            'INSERT INTO sales_stats (category_id, planting_area, annual_output, annual_sales, annual_revenue, price_per_ton) VALUES (?, ?, ?, ?, ?, ?)',
            [
              cat.id, 
              cat.stats.plantingArea || 0, 
              cat.stats.annualOutput || 0, 
              cat.stats.annualSales || 0, 
              cat.stats.annualRevenue || 0, 
              cat.stats.pricePerTon || 0
            ]
          );
          salesCount++;
        }
        
        if (catCount % 20 === 0) {
          console.log(`  已导入 ${catCount} 个品类...`);
        }
      } catch (err) {
        console.error(`导入品类失败: ${cat.name}`, err.message);
      }
    }
    
    console.log(`已导入 ${catCount} 个品类`);
    console.log(`已导入 ${salesCount} 条销售数据`);
    
    // 验证数据
    console.log('\n验证数据...');
    const [categories] = await connection.query('SELECT COUNT(*) as count FROM categories');
    const [cooperatives] = await connection.query('SELECT COUNT(*) as count FROM cooperatives');
    const [sales] = await connection.query('SELECT COUNT(*) as count FROM sales_stats');
    
    console.log(`   品类表: ${categories[0].count} 条记录`);
    console.log(`   合作社表: ${cooperatives[0].count} 条记录`);
    console.log(`   销售数据表: ${sales[0].count} 条记录`);
    
    console.log('\n数据导入完成！');
    
  } catch (error) {
    console.error('导入失败:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('数据库连接已关闭');
    }
  }
}

// 执行导入
importData();