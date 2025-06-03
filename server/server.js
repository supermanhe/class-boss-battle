const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(bodyParser.json());

// 获取所有成绩
app.get('/scores', async (req, res) => {
  console.log('尝试获取所有成绩...');
  try {
    // 首先检查表是否存在
    try {
      console.log('检查表是否存在...');
      await pool.query('SHOW TABLES LIKE "scores"');
      console.log('表检查完成');
    } catch (tableErr) {
      console.error('表检查失败:', tableErr);
      // 如果检查失败，尝试创建表
      try {
        console.log('尝试创建表...');
        await pool.query(`
          CREATE TABLE IF NOT EXISTS scores (
            name VARCHAR(64) PRIMARY KEY,
            score INT
          )
        `);
        console.log('表创建成功或已存在');
      } catch (createErr) {
        console.error('创建表失败:', createErr);
        throw createErr; // 往上抛出错误
      }
    }
    
    // 查询数据
    console.log('正在从数据库查询成绩...');
    const [rows] = await pool.query('SELECT name, score FROM scores');
    console.log('查询成功，返回数据:', rows);
    res.json(rows || []); // 确保始终返回数组，即使是空的
  } catch (err) {
    console.error('数据库查询失败:', err);
    res.status(500).json({ 
      error: '数据库查询失败', 
      details: err.message,
      stack: err.stack
    });
  }
});

// 新增或更新成绩
app.post('/scores', async (req, res) => {
  console.log('收到添加/更新成绩请求:', req.body);
  const { name, score } = req.body;
  if (!name) {
    console.error('验证失败: 姓名为空');
    return res.status(400).json({ error: '姓名不能为空' });
  }
  
  // 确保 score 是数字
  const scoreNum = Number(score);
  if (isNaN(scoreNum)) {
    console.error('验证失败: 成绩不是数字', score);
    return res.status(400).json({ error: '成绩必须是数字' });
  }
  
  try {
    // 首先确认表存在
    try {
      console.log('确认scores表存在...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS scores (
          name VARCHAR(64) PRIMARY KEY,
          score INT
        )
      `);
      console.log('表检查/创建成功');
    } catch (tableErr) {
      console.error('检查/创建表失败:', tableErr);
      throw tableErr;
    }
    
    // 执行插入或更新
    console.log('尝试插入/更新数据:', name, scoreNum);
    await pool.query(
      'INSERT INTO scores (name, score) VALUES (?, ?) ON DUPLICATE KEY UPDATE score = ?',
      [name, scoreNum, scoreNum]
    );
    
    console.log('数据插入/更新成功');
    res.json({ success: true });
  } catch (err) {
    console.error('数据库写入失败:', err);
    res.status(500).json({ 
      error: '数据库写入失败', 
      details: err.message,
      stack: err.stack
    });
  }
});

// 删除成绩（支持 name+score 精确删除）
app.delete('/scores', async (req, res) => {
  console.log('收到删除请求，参数:', req.query);
  const name = req.query.name;
  // 确保score是数字，同时处理score为0的情况
  const score = req.query.score !== undefined ? Number(req.query.score) : undefined;
  
  // 改进参数验证
  if (!name) {
    console.error('删除失败: 缺少姓名参数');
    return res.status(400).json({ error: '缺少姓名参数' });
  }
  
  if (score === undefined || isNaN(score)) {
    console.error('删除失败: 分数参数无效', req.query.score);
    return res.status(400).json({ error: '分数参数无效' });
  }
  
  try {
    console.log('执行删除操作:', name, score);
    const [result] = await pool.query('DELETE FROM scores WHERE name = ? AND score = ?', [name, score]);
    console.log('删除操作结果:', result);
    
    if (result.affectedRows === 0) {
      console.error('未找到记录:', name, score);
      return res.status(404).json({ error: '未找到该学生成绩' });
    }
    
    console.log('删除成功');
    res.json({ success: true });
  } catch (err) {
    console.error('数据库删除失败:', err);
    res.status(500).json({ 
      error: '数据库删除失败',
      details: err.message,
      stack: err.stack
    });
  }
});

// 静态托管前端 build 目录
app.use(express.static(path.join(__dirname, '../build')));

// SPA 兜底路由，所有未知路由返回 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// 添加专门的通配符路由，重定向到根路径
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
