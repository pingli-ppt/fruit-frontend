const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('正在连接数据库...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
    });
    
    console.log('MySQL 连接成功！');
    
    // 创建数据库
    await connection.query('CREATE DATABASE IF NOT EXISTS fruit_db');
    console.log('数据库 fruit_db 创建成功');
    
    await connection.end();
  } catch (error) {
    console.error('连接失败:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('密码错误，请检查 .env 文件中的 DB_PASSWORD');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('MySQL 服务未启动，请先启动 MySQL');
      console.log('试试：net start MySQL57');
    }
  }
}

testConnection();