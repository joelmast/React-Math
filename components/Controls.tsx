import React from 'react';
import { GameState } from '../types';

interface ControlsProps {
  gameState: GameState;
  startGame: () => void;
  resetGame: () => void;
}

const Controls: React.FC<ControlsProps> = ({ gameState, startGame, resetGame }) => {
  const showStartButton = gameState === GameState.Idle || gameState === GameState.Finished;

  return (
    <div className="w-full flex flex-col items-center space-y-4 pt-4">
      <div className="w-full">
        {showStartButton ? (
          <button
            onClick={startGame}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-xl transition-transform transform hover:scale-105"
          >
            {gameState === GameState.Finished ? 'Play Again' : 'Start Game'}
          </button>
        ) : (
          <button
            onClick={resetGame}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-xl transition-transform transform hover:scale-105"
          >
            Reset Game
          </button>
        )}
      </div>
    </div>
  );
};

export default Controls;