
import React, { useEffect, useRef } from 'react';
import { Problem, Feedback } from '../types';

// Standalone icon components to prevent re-definition on each render.
const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface GameBoardProps {
  problem: Problem | null;
  userAnswer: string;
  feedback: Feedback;
  setUserAnswer: (answer: string) => void;
  submitAnswer: () => void;
  isGameActive: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ problem, userAnswer, feedback, setUserAnswer, submitAnswer, isGameActive }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus the input field when the game starts or a new problem is generated.
  useEffect(() => {
    if (isGameActive && feedback === Feedback.None) {
      inputRef.current?.focus();
    }
  }, [problem, isGameActive, feedback]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setUserAnswer(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  const feedbackClasses = {
    [Feedback.None]: 'border-slate-600 focus:border-cyan-500',
    [Feedback.Correct]: 'border-green-500',
    [Feedback.Incorrect]: 'border-red-500',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full h-48">
      {isGameActive ? (
        <>
          <div className="relative w-full flex items-center justify-center">
            <span className="text-5xl md:text-6xl font-bold tracking-wider text-slate-300">
              {problem?.question} = ?
            </span>
             <div className="absolute right-0 top-1/2 -translate-y-1/2 transition-opacity duration-300 opacity-0 data-[show=true]:opacity-100" data-show={feedback !== Feedback.None}>
              {feedback === Feedback.Correct && <CheckIcon />}
              {feedback === Feedback.Incorrect && <XIcon />}
            </div>
          </div>
          <input
            ref={inputRef}
            type="text" // Use text to apply pattern, but handle numeric logic
            inputMode="numeric" // Helps mobile browsers show number pad
            value={userAnswer}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`bg-slate-700 w-full max-w-xs text-center text-4xl p-3 rounded-lg border-4 transition-colors duration-300 focus:outline-none ${feedbackClasses[feedback]}`}
            placeholder="Answer"
            autoComplete="off"
            disabled={feedback !== Feedback.None}
          />
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-300">Welcome to Math Trainer!</h2>
          <p className="text-slate-400 mt-2">The game gets harder as you score. Press Start!</p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
