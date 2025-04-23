import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import HeroBattle from './components/HeroBattle';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Comic Sans MS', 'Arial', sans-serif;
    background: #f2f7fc;
  }
`;

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #f2f7fc 60%, #b3e5fc 100%);
`;

function App() {
  return (
    <AppWrapper>
      <GlobalStyle />
      <h1>班级勇士打BOSS成绩榜</h1>
      <HeroBattle />
    </AppWrapper>
  );
}

export default App;
