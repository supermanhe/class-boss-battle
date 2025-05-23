import React, { useEffect, useState } from 'react';
import ScoreInput from './ScoreInput';
import TabSwitcher from './TabSwitcher';
import Toast from './Toast';
import styled from 'styled-components';

const bossHp = 1000;

const HeroRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const HeroCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5rem;
  padding: 1rem 0.8rem;
  min-width: 90px;
  max-width: 110px;
  position: relative;
  border: 3px solid #ffe082;
  ${(props) => props.rank === 1 && 'border-color: #ff7043;'}
  ${(props) => props.rank === 2 && 'border-color: #42a5f5;'}
  ${(props) => props.rank === 3 && 'border-color: #66bb6a;'}

  @media (max-width: 600px) {
    min-width: 70px;
    max-width: 90px;
    padding: 0.5rem 0.3rem;
  }
`;

const HeroImg = styled.div`
  width: 48px;
  height: 48px;
  background: url('https://img.icons8.com/color/96/000000/knight.png') no-repeat center/cover;
  margin-bottom: 0.3rem;
`;

const RankBadge = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffd600;
  color: #fff;
  font-weight: bold;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  border: 2px solid #fff;
  ${(props) => props.rank === 1 && 'background: #ff7043;'}
  ${(props) => props.rank === 2 && 'background: #42a5f5;'}
  ${(props) => props.rank === 3 && 'background: #66bb6a;'}
`;

const BossSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const BossImg = styled.div`
  width: 120px;
  height: 120px;
  background: url('https://img.icons8.com/color/144/dragon.png') no-repeat center/cover;
  margin-bottom: 0.5rem;

  @media (max-width: 600px) {
    width: 80px;
    height: 80px;
  }
`;

const BossHpBar = styled.div`
  width: 220px;
  background: #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.3rem;
  @media (max-width: 600px) {
    width: 140px;
  }
`;
const BossHp = styled.div`
  height: 18px;
  background: linear-gradient(90deg, #ff7043, #ffd600);
  width: ${(props) => props.percent}%;
  transition: width 0.5s;
`;

const DamageList = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background: #fffde7;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 1rem;
  @media (max-width: 600px) {
    padding: 0.5rem;
  }
`;
const DamageRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;
const DamageBar = styled.div`
  height: 12px;
  background: #81d4fa;
  border-radius: 6px;
  margin-left: 0.5rem;
  flex: 1;
`;

const HeroBattle = () => {
  const [toast, setToast] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('damage'); // 'damage' or 'input'
  const bossHp = 1000;

  // 获取成绩数据
  const fetchScores = async () => {
    try {
      const response = await fetch('/scores');
      if (!response.ok) {
        throw new Error(`服务器响应错误: ${response.status}`);
      }
      const data = await response.json();
      // 确保数据是数组
      const scoresArray = Array.isArray(data) ? data : [];
      console.log('成功获取成绩:', scoresArray);
      setStudents(scoresArray);
    } catch (error) {
      console.error('获取成绩失败:', error);
      // 出错时设置为空数组，避免应用崩溃
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleTabChange = (tabName) => setTab(tabName);

  const handleSubmit = async ({ name, score }) => {
    try {
      await fetch('/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score })
      });
    } catch (err) {
      console.error('Error submitting score:', err);
    }
    await fetchScores();
  };

  const sortedStudents = [...students].sort((a, b) => b.score - a.score);
  const totalScore = sortedStudents.reduce((sum, s) => sum + s.score, 0);
  const bossLeft = Math.max(0, bossHp - totalScore);
  const bossPercent = Math.max(0, 100 - (totalScore / bossHp) * 100);

  return (
    <div style={{width: '100%', maxWidth: 600}}>
      <BossSection>
        <BossImg />
        <div style={{position: 'relative', width: '320px', maxWidth: '98vw', margin: '0 auto 0.3rem auto', overflow: 'visible'}}>
          <BossHpBar style={{position: 'relative', zIndex: 1, width: '100%'}}>
            <BossHp percent={bossPercent} />
          </BossHpBar>
          <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#222', fontSize: 18, pointerEvents: 'none', zIndex: 2}}>
            {bossLeft} / {bossHp}
          </div>
        </div>
      </BossSection>

      <TabSwitcher activeTab={tab} onTabChange={handleTabChange} />
      <div style={{minHeight: 'calc(100vh - 220px)', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingBottom: 16}}>
        {tab === 'damage' && (
          loading ? <div style={{textAlign:'center'}}>加载中...</div> : (
            <>
              {/* 只显示前三名，并特殊布局突出第一名 */}
              <HeroRow style={{justifyContent: 'center', alignItems: 'flex-end', minHeight: 160, paddingTop: 32, overflow: 'visible'}}>
                {sortedStudents.slice(0, 3).length === 1 && (
                  <HeroCard style={{margin: '0 1rem'}} rank={1}>
                    <RankBadge rank={1}>1</RankBadge>
                    <HeroImg />
                    <div style={{fontWeight: 'bold'}}>{sortedStudents[0].name}</div>
                    <div style={{color: '#ff7043', fontWeight: 'bold'}}>{sortedStudents[0].score}分</div>
                  </HeroCard>
                )}
                {sortedStudents.slice(0, 3).length === 2 && (
                  <>
                    <HeroCard style={{margin: '0 1rem'}} rank={1}>
                      <RankBadge rank={1}>1</RankBadge>
                      <HeroImg />
                      <div style={{fontWeight: 'bold'}}>{sortedStudents[0].name}</div>
                      <div style={{color: '#ff7043', fontWeight: 'bold'}}>{sortedStudents[0].score}分</div>
                    </HeroCard>
                    <HeroCard style={{margin: '0 1rem'}} rank={2}>
                      <RankBadge rank={2}>2</RankBadge>
                      <HeroImg />
                      <div style={{fontWeight: 'bold'}}>{sortedStudents[1].name}</div>
                      <div style={{color: '#ff7043', fontWeight: 'bold'}}>{sortedStudents[1].score}分</div>
                    </HeroCard>
                  </>
                )}
                {sortedStudents.slice(0, 3).length === 3 && (
                  <>
                    <HeroCard style={{margin: '0 1rem 16px 1rem', transform: 'translateY(20px)', zIndex: 1}} rank={2}>
                      <RankBadge rank={2}>2</RankBadge>
                      <HeroImg />
                      <div style={{fontWeight: 'bold'}}>{sortedStudents[1].name}</div>
                      <div style={{color: '#ff7043', fontWeight: 'bold'}}>{sortedStudents[1].score}分</div>
                    </HeroCard>
                    <HeroCard style={{margin: '0 1rem', transform: 'translateY(-20px) scale(1.15)', boxShadow: '0 4px 16px rgba(255,112,67,0.18)', zIndex: 2, borderWidth: 4}} rank={1}>
                      <RankBadge rank={1}>1</RankBadge>
                      <HeroImg />
                      <div style={{fontWeight: 'bold', fontSize: 18}}>{sortedStudents[0].name}</div>
                      <div style={{color: '#ff7043', fontWeight: 'bold', fontSize: 18}}>{sortedStudents[0].score}分</div>
                    </HeroCard>
                    <HeroCard style={{margin: '0 1rem 16px 1rem', transform: 'translateY(20px)', zIndex: 1}} rank={3}>
                      <RankBadge rank={3}>3</RankBadge>
                      <HeroImg />
                      <div style={{fontWeight: 'bold'}}>{sortedStudents[2].name}</div>
                      <div style={{color: '#ff7043', fontWeight: 'bold'}}>{sortedStudents[2].score}分</div>
                    </HeroCard>
                  </>
                )}
              </HeroRow>

              <h3 style={{textAlign: 'center'}}>勇士们的伤害贡献排名</h3>
              <DamageList>
                {sortedStudents.map((stu, idx) => (
                  <DamageRow key={stu.name}>
                    <span style={{width: 50, display: 'inline-block'}}>{stu.name}</span>
                    <span style={{width: 40, color: '#ff7043', fontWeight: idx<3?'bold':'normal'}}>{stu.score}</span>
                    <DamageBar style={{width: `${(stu.score/Math.max(...sortedStudents.map(s=>s.score)))*80}%`}} />
                  </DamageRow>
                ))}
              </DamageList>
            </>
          )
        )}
        {tab === 'input' && (
          <ScoreInput
            onSubmit={handleSubmit}
            scores={students}
            onEdit={async (idx, newStu) => {
              // 编辑直接调用后端POST覆盖
              try {
                await fetch('/scores', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newStu)
                });
                await fetchScores();
              } catch (err) {
                console.error('Error editing score:', err);
                setToast('编辑失败');
              }
            }}
            onDelete={async (idx) => {
              // 删除调用后端DELETE，传递name和score
              try {
                const { name, score } = students[idx];
                const res = await fetch(`/scores?name=${encodeURIComponent(name)}&score=${encodeURIComponent(score)}`, { method: 'DELETE' });
                if (res.ok) {
                  await fetchScores();
                  setToast('删除成功');
                } else {
                  console.error('Delete failed with status:', res.status);
                  setToast('删除失败');
                }
              } catch (err) {
                console.error('Error deleting score:', err);
                setToast('删除失败');
              }
            }}
          />
        )}
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
};

export default HeroBattle;
