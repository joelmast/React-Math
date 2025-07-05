import React, { useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import Scoreboard from './components/Scoreboard';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import RoundSummary from './components/RoundSummary';
import StatsPage from './components/StatsPage';
import Header from './components/Header';
import { GameState, AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.Game);
  const {
    gameState,
    score,
    highScore,
    timeLeft,
    currentProblem,
    userAnswer,
    feedback,
    pastRounds,
    lastRoundStats,
    startGame,
    resetGame,
    setUserAnswer,
    submitAnswer,
  } = useGameLogic();

  const renderGameContent = () => {
    if (gameState === GameState.Finished && lastRoundStats) {
      return <RoundSummary stats={lastRoundStats} highScore={highScore} />;
    }
    return (
      <GameBoard
        problem={currentProblem}
        userAnswer={userAnswer}
        feedback={feedback}
        setUserAnswer={setUserAnswer}
        submitAnswer={submitAnswer}
        isGameActive={gameState === GameState.Playing}
      />
    );
  };
  
  return (
    <main className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4 selection:bg-cyan-300 selection:text-cyan-900">
      <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg space-y-6">
        <Header currentView={view} setView={setView} />
        
        {view === AppView.Game ? (
          <>
            <Scoreboard score={score} highScore={highScore} timeLeft={timeLeft} />
            {renderGameContent()}
            <Controls
              gameState={gameState}
              startGame={startGame}
              resetGame={resetGame}
            />
          </>
        ) : (
          <StatsPage pastRounds={pastRounds} />
        )}

      </div>
      <footer className="text-center mt-6 text-slate-500 text-sm">
        <p>Practice your math skills and beat your high score!</p>
      </footer>
    </main>
  );
};

export default App;