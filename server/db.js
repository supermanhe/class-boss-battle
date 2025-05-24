// server/db.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// 判断当前环境
const isProduction = process.env.NODE_ENV === 'production';

// 创建数据目录
const dbDir = path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;

// 生产环境使用MySQL，本地开发使用SQLite
if (isProduction) {
  console.log('使用MySQL数据库 (生产环境)');
  const mysql = require('mysql2/promise');
  
  // 检查所有可用的环境变量
  console.log('环境变量列表:');
  for (const key in process.env) {
    if (key.includes('MYSQL') || key.includes('DATABASE') || key.includes('DB_')) {
      console.log(`${key}: ${key.includes('PASSWORD') ? '****' : process.env[key]}`);
    }
  }
  
  // 尝试多种连接方式
  let mysqlConfig;
  
  // 优先使用完整的连接字符串
  if (process.env.MYSQL_URL || process.env.DATABASE_URL) {
    const connectionString = process.env.MYSQL_URL || process.env.DATABASE_URL;
    console.log('使用连接字符串方式:', connectionString.replace(/:[^:@]+@/, ':****@'));
    mysqlConfig = { uri: connectionString };
  } 
  // 如果没有连接字符串，尝试使用单独的参数
  else if (process.env.MYSQLHOST || process.env.DB_HOST) {
    const host = process.env.MYSQLHOST || process.env.DB_HOST || 'localhost';
    const port = process.env.MYSQLPORT || process.env.DB_PORT || 3306;
    const user = process.env.MYSQLUSER || process.env.DB_USER || 'root';
    const password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '';
    const database = process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway';
    
    console.log(`使用参数方式连接: ${user}@${host}:${port}/${database}`);
    
    mysqlConfig = {
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
  } 
  // 使用默认值作为备用
  else {
    console.log('没有找到MySQL连接信息，使用默认连接信息');
    mysqlConfig = {
      uri: 'mysql://root:ddkQHENgflNChsQOfNjvPcPcyCaeHRNO@mysql.railway.internal:3306/railway'
    };
  }
  
  try {
    db = mysql.createPool(mysqlConfig);
    console.log('MySQL连接池创建成功');
  } catch (err) {
    console.error('MySQL连接池创建失败:', err);
    throw err;
  }
} else {
  console.log('使用SQLite数据库 (本地开发)');
  const sqlite = require('better-sqlite3');
  const dbPath = path.join(dbDir, 'scores.sqlite');
  const sqliteDb = sqlite(dbPath);
  
  // 创建表
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      name TEXT PRIMARY KEY,
      score INTEGER
    )
  `);
  
  // 创建类似MySQL的接口
  db = {
    query: async (sql, params) => {
      // 处理INSERT语句
      if (sql.includes('INSERT INTO scores') && sql.includes('ON DUPLICATE KEY UPDATE')) {
        const name = params[0];
        const score = params[1];
        
        try {
          // 尝试插入
          const stmt = sqliteDb.prepare('INSERT INTO scores (name, score) VALUES (?, ?)');
          stmt.run(name, score);
        } catch (e) {
          if (e.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
            // 如果主键冲突，则更新
            const updateStmt = sqliteDb.prepare('UPDATE scores SET score = ? WHERE name = ?');
            updateStmt.run(score, name);
          } else {
            throw e;
          }
        }
        return [{ affectedRows: 1 }];
      }
      
      // 处理SELECT语句
      if (sql.includes('SELECT')) {
        const stmt = sqliteDb.prepare(sql.replace('?', '$1').replace('?', '$2'));
        let rows;
        if (params && params.length > 0) {
          rows = stmt.all(...params);
        } else {
          rows = stmt.all();
        }
        return [rows];
      }
      
      // 处理DELETE语句
      if (sql.includes('DELETE FROM scores')) {
        const stmt = sqliteDb.prepare('DELETE FROM scores WHERE name = ? AND score = ?');
        const result = stmt.run(params[0], params[1]);
        return [{ affectedRows: result.changes }];
      }
      
      throw new Error(`不支持的SQL: ${sql}`);
    }
  };
}

console.log('数据库连接已初始化');

module.exports = db;
