const db = require('../config/database');

class Cooperative {
  // 获取所有合作社
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM cooperatives ORDER BY name');
    return rows;
  }

  // 根据ID查找合作社
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM cooperatives WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = Cooperative;