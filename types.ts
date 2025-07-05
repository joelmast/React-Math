/**
 * Represents the different states the game can be in.
 */
export enum GameState {
  Idle,
  Playing,
  Finished,
}

/**
 * Represents the different views in the application.
 */
export enum AppView {
  Game,
  Stats,
}

/**
 * Represents the difficulty levels for the math problems.
 */
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

/**
 * Represents the feedback state after a user submits an answer.
 */
export enum Feedback {
  None,
  Correct,
  Incorrect,
}

/**
 * Defines the structure of a single math problem.
 */
export interface Problem {
  question: string;
  answer: number;
}

/**
 * Defines the structure for storing statistics of a completed round.
 */
export interface RoundStats {
  score: number;
  incorrectAnswers: number;
  accuracy: number;
  timestamp: number;
}