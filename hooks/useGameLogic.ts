import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Difficulty, Feedback, Problem, RoundStats } from '../types';

const GAME_DURATION = 30; // Game duration is 30 seconds
const DIFFICULTY_THRESHOLDS = {
  MEDIUM: 5,
  HARD: 10,
};

/**
 * Custom hook to manage the state and logic of the math trainer game.
 * @returns An object containing game state and handler functions.
 */
export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [internalDifficulty, setInternalDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [score, setScore] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback>(Feedback.None);
  const [pastRounds, setPastRounds] = useState<RoundStats[]>([]);
  const [lastRoundStats, setLastRoundStats] = useState<RoundStats | null>(null);

  // Load past rounds from localStorage on initial mount
  useEffect(() => {
    try {
      const storedRounds = localStorage.getItem('mathTrainerPastRounds');
      if (storedRounds) {
        const rounds: RoundStats[] = JSON.parse(storedRounds);
        setPastRounds(rounds);
        const maxScore = rounds.reduce((max, round) => Math.max(max, round.score), 0);
        setHighScore(maxScore);
      }
    } catch (error) {
      console.error("Failed to load past rounds from localStorage", error);
    }
  }, []);

  /**
   * Generates a random integer between min and max (inclusive).
   */
  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * Generates a new math problem based on the current internal difficulty.
   */
  const generateProblem = useCallback(() => {
    const difficultyRanges = {
      [Difficulty.Easy]: { addSub: 10, mult: 10, div: 10 },
      [Difficulty.Medium]: { addSub: 50, mult: 20, div: 50 },
      [Difficulty.Hard]: { addSub: 100, mult: 30, div: 100 },
    };
    
    const range = difficultyRanges[internalDifficulty];
    const operators = ['+', '-', '*', '/'];
    const operator = operators[getRandomNumber(0, 3)];

    let num1: number, num2: number, question: string, answer: number;

    switch (operator) {
      case '+':
        num1 = getRandomNumber(1, range.addSub);
        num2 = getRandomNumber(1, range.addSub);
        question = `${num1} + ${num2}`;
        answer = num1 + num2;
        break;
      case '-':
        num1 = getRandomNumber(5, range.addSub);
        num2 = getRandomNumber(1, num1 - 1); // Ensure result is positive
        question = `${num1} - ${num2}`;
        answer = num1 - num2;
        break;
      case '*':
        num1 = getRandomNumber(2, range.mult);
        num2 = getRandomNumber(2, range.mult);
        question = `${num1} × ${num2}`;
        answer = num1 * num2;
        break;
      case '/':
        const divisor = getRandomNumber(2, range.div / 5); // Keep divisor smaller
        const quotient = getRandomNumber(2, range.div / 5);
        const dividend = divisor * quotient;
        question = `${dividend} ÷ ${divisor}`;
        answer = quotient;
        break;
      default:
        // Fallback to addition
        num1 = getRandomNumber(1, 10);
        num2 = getRandomNumber(1, 10);
        question = `${num1} + ${num2}`;
        answer = num1 + num2;
    }
    setCurrentProblem({ question, answer });
  }, [internalDifficulty]);


  // Timer logic
  useEffect(() => {
    if (gameState !== GameState.Playing) return;

    if (timeLeft === 0) {
      setGameState(GameState.Finished);
      
      const totalAttempts = score + incorrectAnswers;
      const accuracy = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;
      const newRoundStats: RoundStats = {
        score,
        incorrectAnswers,
        accuracy,
        timestamp: Date.now(),
      };

      setLastRoundStats(newRoundStats);
      
      const updatedRounds = [...pastRounds, newRoundStats];
      setPastRounds(updatedRounds);

      if (score > highScore) {
        setHighScore(score);
      }

      try {
        localStorage.setItem('mathTrainerPastRounds', JSON.stringify(updatedRounds));
        if (score > highScore) {
           localStorage.setItem('mathTrainerHighScore', score.toString());
        }
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, timeLeft, score, incorrectAnswers, highScore, pastRounds]);
  
  /**
   * Starts a new game.
   */
  const startGame = useCallback(() => {
    setScore(0);
    setIncorrectAnswers(0);
    setTimeLeft(GAME_DURATION);
    setGameState(GameState.Playing);
    setInternalDifficulty(Difficulty.Easy); // Always start on Easy
    setUserAnswer('');
    setFeedback(Feedback.None);
    setLastRoundStats(null);
    generateProblem();
  }, [generateProblem]);

  /**
   * Resets the game to its initial idle state.
   */
  const resetGame = useCallback(() => {
    setGameState(GameState.Idle);
    setScore(0);
    setIncorrectAnswers(0);
    setTimeLeft(GAME_DURATION);
    setCurrentProblem(null);
    setUserAnswer('');
    setLastRoundStats(null);
  }, []);

  // Effect to handle adaptive difficulty based on score.
  useEffect(() => {
    if (gameState !== GameState.Playing) return;

    if (score >= DIFFICULTY_THRESHOLDS.HARD) {
      setInternalDifficulty(Difficulty.Hard);
    } else if (score >= DIFFICULTY_THRESHOLDS.MEDIUM) {
      setInternalDifficulty(Difficulty.Medium);
    } else {
      setInternalDifficulty(Difficulty.Easy);
    }
  }, [score, gameState]);

  /**
   * Handles the submission of an answer.
   */
  const submitAnswer = useCallback(() => {
    if (!currentProblem || userAnswer === '' || gameState !== GameState.Playing) return;

    const answerIsCorrect = parseInt(userAnswer, 10) === currentProblem.answer;

    if (answerIsCorrect) {
      setScore((prevScore) => prevScore + 1);
      setFeedback(Feedback.Correct);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
      setFeedback(Feedback.Incorrect);
    }

    setUserAnswer('');
    
    // Show feedback for a short duration, then generate next problem
    setTimeout(() => {
      setFeedback(Feedback.None);
      generateProblem();
    }, 400);

  }, [userAnswer, currentProblem, generateProblem, gameState]);

  return {
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
  };
};