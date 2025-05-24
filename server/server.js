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
  try {
    const [rows] = await pool.query('SELECT name, score FROM scores');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: '数据库查询失败' });
  }
});

// 新增或更新成绩
app.post('/scores', async (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: '姓名和成绩不能为空' });
  }
  try {
    await pool.query(
      'INSERT INTO scores (name, score) VALUES (?, ?) ON DUPLICATE KEY UPDATE score = ?',
      [name, score, score]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '数据库写入失败' });
  }
});

// 删除成绩（支持 name+score 精确删除）
app.delete('/scores', async (req, res) => {
  const name = req.query.name;
  const score = req.query.score ? Number(req.query.score) : undefined;
  if (!name || typeof score !== 'number') return res.status(400).json({ error: '缺少参数' });
  try {
    const [result] = await pool.query('DELETE FROM scores WHERE name = ? AND score = ?', [name, score]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '未找到该学生成绩' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '数据库删除失败' });
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
