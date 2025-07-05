import React from 'react';
import { RoundStats } from '../types';

interface RoundSummaryProps {
  stats: RoundStats;
  highScore: number;
}

const StatItem: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = '' }) => (
  <div className={`flex justify-between items-baseline w-full text-lg ${className}`}>
    <span className="text-slate-400">{label}</span>
    <span className="font-bold text-white">{value}</span>
  </div>
);

const RoundSummary: React.FC<RoundSummaryProps> = ({ stats, highScore }) => {
  const { score, incorrectAnswers, accuracy } = stats;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full h-48 animate-fade-in">
        <div className="text-center w-full">
            <h2 className="text-2xl font-bold text-cyan-400">Time's Up!</h2>
            {score >= highScore && score > 0 && (
                <p className="text-green-400 font-semibold animate-pulse mt-1">New High Score!</p>
            )}
        </div>
        
        <div className="w-full max-w-xs bg-slate-900/50 p-4 rounded-lg space-y-2">
            <h3 className="text-xl font-bold text-slate-200 mb-3 text-center">Round Stats</h3>
            <StatItem label="Final Score" value={score} className="text-cyan-400" />
            <StatItem label="Incorrect" value={incorrectAnswers} />
            <StatItem label="Accuracy" value={`${accuracy}%`} />
        </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default RoundSummary;
