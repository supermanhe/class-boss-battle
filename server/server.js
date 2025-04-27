const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'scores.json');

app.use(cors());
app.use(bodyParser.json());

// 读取成绩数据
function readScores() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 写入成绩数据
function writeScores(scores) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(scores, null, 2), 'utf-8');
}

// 获取所有成绩
app.get('/scores', (req, res) => {
  const scores = readScores();
  res.json(scores);
});

// 新增或更新成绩
app.post('/scores', (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: '姓名和成绩不能为空' });
  }
  let scores = readScores();
  const idx = scores.findIndex(s => s.name === name);
  if (idx !== -1) {
    scores[idx].score = score;
  } else {
    scores.push({ name, score });
  }
  writeScores(scores);
  res.json({ success: true });
});

// 删除成绩（支持 name+score 精确删除）
app.delete('/scores', (req, res) => {
  const name = req.query.name;
  const score = req.query.score ? Number(req.query.score) : undefined;
  if (!name || typeof score !== 'number') return res.status(400).json({ error: '缺少参数' });
  let scores = readScores();
  const newScores = scores.filter(s => !(s.name === name && s.score === score));
  if (newScores.length === scores.length) {
    return res.status(404).json({ error: '未找到该学生成绩' });
  }
  writeScores(newScores);
  res.json({ success: true });
});

// 静态托管前端 build 目录
app.use(express.static(path.join(__dirname, '../build')));
// SPA 兜底路由，所有未知路由返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
