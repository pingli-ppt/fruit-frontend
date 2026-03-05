const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 数据库配置（你现有的，完全不变）
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'food_safety'  // 继续用你这个库
});

// ==============================================
// 一、原有接口（科普文章，完全保留不动）
// ==============================================

// 首页
app.get('/', (req, res) => {
  res.send('后端服务启动成功！可用接口：<br>\
  1. /api/science/list<br>\
  2. /api/science/detail/1<br>\
  3. /api/trace/query?code=批次号<br>\
  4. /api/quality/tags<br>');
});

// 文章列表
app.get('/api/science/list', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM science_article');
    res.json({ code: 200, data: rows });
  } catch (err) {
    res.json({ code: 500, message: '获取失败', error: err.message });
  }
});

// 文章详情
app.get('/api/science/detail/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM science_article WHERE id = ?', [req.params.id]);
    res.json({ code: 200, data: rows[0] });
  } catch (err) {
    res.json({ code: 500, message: '获取失败', error: err.message });
  }
});

// ==============================================
// 二、新增：溯源 & 质检模块（你要的功能）
// ==============================================

/**
 * 1. 溯源查询接口（支持 批次号 / 溯源码 查询）
 * 调用：GET /api/trace/query?code=PC202509001
 */
app.get('/api/trace/query', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.json({ code: 400, message: '请输入批次号或溯源码' });
    }

    // 1. 查询批次主表
    const [batch] = await db.query(
      'SELECT * FROM trace_batch WHERE batch_code = ? OR trace_code = ?',
      [code, code]
    );

    if (batch.length === 0) {
      return res.json({ code: 404, message: '未找到该批次溯源信息' });
    }

    // 2. 查询溯源时间线（种植/检测/物流/主体）
    const [timeline] = await db.query(
      'SELECT title, operate_time AS time, content FROM trace_timeline WHERE batch_code = ? ORDER BY id',
      [code]
    );

    // 3. 合并返回
    const data = { ...batch[0], timeline };
    res.json({ code: 200, data });

  } catch (err) {
    res.json({ code: 500, message: '溯源查询失败', error: err.message });
  }
});

/**
 * 2. 获取质检标签列表（有机/绿色/无公害等）
 * 调用：GET /api/quality/tags
 */
app.get('/api/quality/tags', async (req, res) => {
  try {
    const [tags] = await db.query('SELECT * FROM quality_tag');
    res.json({ code: 200, data: tags });
  } catch (err) {
    res.json({ code: 500, message: '获取标签失败', error: err.message });
  }
});

// 启动服务（不变）
app.listen(3000, () => {
  console.log('后端服务已启动：http://localhost:3000');
});