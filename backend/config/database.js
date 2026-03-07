const mysql = require('mysql2');
require('dotenv').config();

// 从环境变量读取数据库配置
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'fruit_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// 检查是否配置了密码
if (!process.env.DB_PASSWORD) {
  console.warn('警告: 数据库密码未配置，请在 .env 文件中设置 DB_PASSWORD');
}

// 使用Promise包装
const promisePool = pool.promise();

module.exports = promisePool;