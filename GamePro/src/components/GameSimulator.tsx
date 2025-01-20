import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { calculateNewStats, GameResult } from '../lib/gameCalculations';
import { Play, Pause, RefreshCw } from 'lucide-react';

export default function GameSimulator() {
  const { user, updateStats } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [currentGame, setCurrentGame] = useState<GameResult>({
    won: false,
    duration: 0,
    reactionTimes: [],
    score: 0
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setGameTime(prev => prev + 1);
        
        // Simulate reaction time events
        if (Math.random() < 0.2) { // 20% chance each second
          setCurrentGame(prev => ({
            ...prev,
            reactionTimes: [
              ...prev.reactionTimes,
              Math.floor(150 + Math.random() * 300) // 150-450ms
            ],
            score: prev.score + Math.floor(Math.random() * 50)
          }));
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setCurrentGame({
      won: false,
      duration: 0,
      reactionTimes: [],
      score: 0
    });
    setGameTime(0);
  };

  const endGame = async () => {
    setIsPlaying(false);
    
    const finalGame: GameResult = {
      ...currentGame,
      won: Math.random() > 0.4, // 60% win rate
      duration: gameTime
    };

    if (user?.stats) {
      const newStats = calculateNewStats(user.stats, finalGame);
      await updateStats(newStats);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Game Simulator</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">Current Game Time</p>
            <p className="text-2xl font-bold">{gameTime}s</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">Score</p>
            <p className="text-2xl font-bold">{currentGame.score}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">Reactions</p>
            <p className="text-2xl font-bold">{currentGame.reactionTimes.length}</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {!isPlaying ? (
            <button
              onClick={startGame}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>Start Game</span>
            </button>
          ) : (
            <button
              onClick={endGame}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Pause className="h-4 w-4" />
              <span>End Game</span>
            </button>
          )}
        </div>

        {currentGame.reactionTimes.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-2">Recent Reaction Times (ms):</p>
            <div className="flex flex-wrap gap-2">
              {currentGame.reactionTimes.slice(-5).map((time, i) => (
                <span key={i} className="px-2 py-1 bg-white rounded-md text-sm">
                  {time}ms
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}