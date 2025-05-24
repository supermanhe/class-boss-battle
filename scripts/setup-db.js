// scripts/setup-db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  console.log('开始设置数据库...');
  
  // 使用环境变量中的数据库连接字符串
  const mysqlUrl = process.env.MYSQL_URL || 'mysql://root:ddkQHENgflNChsQOfNjvPcPcyCaeHRNO@mysql.railway.internal:3306/railway';
  
  try {
    // 创建连接池
    const pool = mysql.createPool({ uri: mysqlUrl });
    console.log('已连接到数据库');
    
    // 创建scores表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scores (
        name VARCHAR(64) PRIMARY KEY,
        score INT
      )
    `);
    console.log('scores表创建成功或已存在');
    
    // 查询表中的数据
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM scores');
    console.log(`当前scores表中有 ${rows[0].count} 条记录`);
    
    console.log('数据库设置完成！');
    process.exit(0);
  } catch (error) {
    console.error('数据库设置失败:', error);
    process.exit(1);
  }
}

setupDatabase();
