import React, { useState } from 'react';

const ScoreList = ({ scores, onEdit, onDelete }) => {
  const [editIdx, setEditIdx] = useState(-1);
  const [editName, setEditName] = useState('');
  const [editScore, setEditScore] = useState('');
  const [confirmIdx, setConfirmIdx] = useState(-1);

  const handleEditClick = (idx) => {
    setEditIdx(idx);
    setEditName(scores[idx].name);
    setEditScore(scores[idx].score);
    setConfirmIdx(-1);
  };

  const handleEditSave = (idx) => {
    if (!editName.trim() || editScore === '') return;
    onEdit(idx, { name: editName.trim(), score: Number(editScore) });
    setEditIdx(-1);
  };

  const handleDeleteClick = (idx) => {
    setConfirmIdx(idx);
    setEditIdx(-1);
  };

  const handleDeleteConfirm = (idx) => {
    onDelete(idx);
    setConfirmIdx(-1);
  };

  return (
    <div style={{margin: '0.5rem 0', width: '100%'}}>
      {scores.length === 0 && (
        <div style={{textAlign: 'center', color: '#aaa', fontSize: 15}}>暂无成绩记录</div>
      )}
      {scores.map((stu, idx) => (
        <div
          key={stu.name + idx}
          style={{
            display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            marginBottom: 10, padding: '10px 12px', fontSize: 16
          }}
        >
          {editIdx === idx ? (
            <>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                style={{width: 80, marginRight: 8, borderRadius: 4, border: '1px solid #ccc', padding: 4, fontSize: 15}}
              />
              <input
                type="number"
                value={editScore}
                onChange={e => setEditScore(e.target.value)}
                style={{width: 54, marginRight: 8, borderRadius: 4, border: '1px solid #ccc', padding: 4, fontSize: 15}}
              />
              <button onClick={() => handleEditSave(idx)} style={{color:'#2196f3', background:'none', border:'none', fontWeight:'bold', fontSize:15, marginRight:8}}>保存</button>
              <button onClick={() => setEditIdx(-1)} style={{color:'#aaa', background:'none', border:'none', fontSize:15}}>取消</button>
            </>
          ) : (
            <>
              <span style={{width: 80, marginRight: 8}}>{stu.name}</span>
              <span style={{width: 54, marginRight: 8, color:'#ff7043', fontWeight:'bold'}}>{stu.score}</span>
              <button onClick={() => handleEditClick(idx)} style={{background:'none', border:'none', marginRight:8}} title="修改">
                <img src="https://img.icons8.com/ios-filled/24/2196f3/edit--v1.png" alt="edit" style={{width:22, height:22}} />
              </button>
              <button onClick={() => handleDeleteClick(idx)} style={{background:'none', border:'none'}} title="删除">
                <img src="https://img.icons8.com/ios-glyphs/24/fa314a/trash--v1.png" alt="delete" style={{width:22, height:22}} />
              </button>
            </>
          )}
          {confirmIdx === idx && (
            <div style={{marginLeft:12, color:'#fa314a', fontSize:15, display:'flex', alignItems:'center'}}>
              确认删除？
              <button onClick={() => handleDeleteConfirm(idx)} style={{background:'none', color:'#fa314a', border:'none', fontWeight:'bold', marginLeft:6}}>删除</button>
              <button onClick={() => setConfirmIdx(-1)} style={{background:'none', color:'#aaa', border:'none', marginLeft:4}}>取消</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScoreList;
