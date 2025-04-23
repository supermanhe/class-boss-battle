import React from 'react';
import styled from 'styled-components';

// 虚拟成绩数据
const students = [
  { name: '小明', score: 98 },
  { name: '小红', score: 95 },
  { name: '小刚', score: 92 },
  { name: '小丽', score: 85 },
  { name: '小强', score: 80 },
  { name: '小芳', score: 78 },
  { name: '小军', score: 70 },
  { name: '小雪', score: 68 },
  { name: '小鹏', score: 60 },
  { name: '小慧', score: 55 }
];

const sortedStudents = [...students].sort((a, b) => b.score - a.score);
const bossHp = 1000;
const totalScore = sortedStudents.reduce((sum, s) => sum + s.score, 0);

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
  // 计算BOSS剩余血量
  const bossLeft = Math.max(0, bossHp - totalScore);
  const bossPercent = Math.max(0, 100 - (totalScore / bossHp) * 100);

  return (
    <div style={{width: '100%', maxWidth: 600}}>
      <BossSection>
        <BossImg />
        <BossHpBar>
          <BossHp percent={bossPercent} />
        </BossHpBar>
        <div>龙BOSS 剩余HP: {bossLeft} / {bossHp}</div>
      </BossSection>

      <HeroRow>
        {sortedStudents.map((stu, idx) => (
          <HeroCard key={stu.name} rank={idx+1 <= 3 ? idx+1 : undefined}>
            {idx < 3 && <RankBadge rank={idx+1}>{idx+1}</RankBadge>}
            <HeroImg />
            <div style={{fontWeight: 'bold'}}>{stu.name}</div>
            <div style={{color: '#ff7043', fontWeight: 'bold'}}>{stu.score}分</div>
          </HeroCard>
        ))}
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
    </div>
  );
};

export default HeroBattle;
