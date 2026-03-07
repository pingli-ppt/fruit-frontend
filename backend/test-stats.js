const db = require('./config/database');

async function testStats() {
  try {
    console.log('1. 测试数据库连接...');
    const [result] = await db.query('SELECT 1+1 as test');
    console.log('数据库连接正常:', result);
    
    console.log('\n2. 查询categories表...');
    const [categories] = await db.query('SELECT COUNT(*) as count FROM categories');
    console.log('categories表记录数:', categories[0].count);
    
    console.log('\n3. 查询cooperatives表...');
    const [cooperatives] = await db.query('SELECT COUNT(*) as count FROM cooperatives');
    console.log('cooperatives表记录数:', cooperatives[0].count);
    
    console.log('\n4. 查询sales_stats表...');
    const [sales] = await db.query('SELECT COUNT(*) as count FROM sales_stats');
    console.log('sales_stats表记录数:', sales[0].count);
    
    console.log('\n5. 查询有销售数据的品类...');
    const [withSales] = await db.query(`
      SELECT COUNT(DISTINCT c.id) as count 
      FROM categories c
      INNER JOIN sales_stats s ON c.id = s.category_id
      WHERE s.annual_sales > 0
    `);
    console.log('有销售数据的品类数:', withSales[0].count);
    
    console.log('\n6. 查询示范合作社...');
    const [demo] = await db.query(`
      SELECT COUNT(*) as count 
      FROM cooperatives 
      WHERE level IS NOT NULL 
        AND level != '' 
        AND level != '否'
    `);
    console.log('示范合作社数:', demo[0].count);
    
  } catch (error) {
    console.error('错误:', error);
  } finally {
    process.exit();
  }
}

testStats();