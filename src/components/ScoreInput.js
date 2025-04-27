import React, { useState } from 'react';
import ScoreList from './ScoreList';

const ScoreInput = ({ onSubmit, scores, onEdit, onDelete }) => {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !score) {
      setMsg('请输入姓名和成绩');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      await onSubmit({ name: name.trim(), score: Number(score) });
      setMsg('提交成功！');
      setName('');
      setScore('');
    } catch (err) {
      setMsg('提交失败，请重试');
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{margin: '1.5rem auto', maxWidth: 320, background: '#fffde7', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
        <h3>老师录入成绩</h3>
        <div style={{marginBottom: 8}}>
          <input
            type="text"
            placeholder="学生姓名"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{width: '60%', padding: 6, marginRight: 8, borderRadius: 4, border: '1px solid #ccc'}}
          />
          <input
            type="number"
            placeholder="成绩"
            value={score}
            onChange={e => setScore(e.target.value)}
            style={{width: '30%', padding: 6, borderRadius: 4, border: '1px solid #ccc'}}
          />
        </div>
        <button type="submit" disabled={loading} style={{padding: '6px 16px', borderRadius: 4, background: '#ff7043', color: '#fff', border: 'none', fontWeight: 'bold'}}>
          {loading ? '提交中...' : '提交'}
        </button>
        {msg && <div style={{marginTop: 8, color: msg.includes('成功') ? 'green' : 'red'}}>{msg}</div>}
      </form>
      <ScoreList scores={scores} onEdit={onEdit} onDelete={onDelete} />
    </>
  );
};

export default ScoreInput;
