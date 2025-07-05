import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
    currentView: AppView;
    setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    const isGameView = currentView === AppView.Game;

    const toggleView = () => {
        setView(isGameView ? AppView.Stats : AppView.Game);
    };

    return (
        <div className="flex justify-between items-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 tracking-widest">
                MATH TRAINER
            </h1>
            <button 
                onClick={toggleView}
                className="bg-slate-700 hover:bg-slate-600 text-cyan-400 font-semibold py-2 px-4 rounded-lg transition-colors"
                aria-label={isGameView ? "View statistics" : "Return to game"}
            >
                {isGameView ? 'View Stats' : 'Back to Game'}
            </button>
        </div>
    );
};

export default Header;
