
import React from 'react';

interface ScoreboardProps {
  score: number;
  highScore: number;
  timeLeft: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, highScore, timeLeft }) => {
  const timerColor = timeLeft <= 10 ? 'text-red-400' : 'text-cyan-400';

  return (
    <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg w-full text-lg sm:text-xl">
      <div className="text-left">
        <p>Score: <span className="font-bold text-cyan-400">{score}</span></p>
        <p>High Score: <span className="font-bold">{highScore}</span></p>
      </div>
      <div className="text-right">
        <p>Time Left</p>
        <p className={`font-bold text-4xl ${timerColor}`}>{timeLeft}</p>
      </div>
    </div>
  );
};

export default Scoreboard;
