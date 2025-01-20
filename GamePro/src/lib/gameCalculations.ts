import { PlayerStats, Achievement } from '../types';

export interface GameResult {
  won: boolean;
  duration: number; // in seconds
  reactionTimes: number[]; // in milliseconds
  score: number;
}

export function calculateNewStats(currentStats: PlayerStats, gameResult: GameResult): Partial<PlayerStats> {
  const totalGames = Math.floor(currentStats.totalPlayTime / 5); // Assume each game is ~5 minutes
  const newTotalGames = totalGames + 1;

  // Calculate new win rate
  const currentWins = Math.floor(totalGames * currentStats.winRate);
  const newWins = gameResult.won ? currentWins + 1 : currentWins;
  const newWinRate = newWins / newTotalGames;

  // Calculate new reaction time (weighted average)
  const avgReactionTime = gameResult.reactionTimes.reduce((a, b) => a + b, 0) / gameResult.reactionTimes.length;
  const newReactionTime = currentStats.reactionTime === 0 
    ? avgReactionTime 
    : (currentStats.reactionTime * 0.7 + avgReactionTime * 0.3);

  // Calculate new skill level
  const skillPoints = calculateSkillPoints(gameResult);
  const newSkillLevel = Math.min(100, Math.floor(currentStats.skillLevel + skillPoints));

  // Check for new achievements
  const newAchievements = [
    ...currentStats.achievements,
    ...checkNewAchievements(currentStats, gameResult)
  ];

  return {
    totalPlayTime: currentStats.totalPlayTime + Math.floor(gameResult.duration / 60),
    winRate: newWinRate,
    reactionTime: Math.round(newReactionTime),
    skillLevel: newSkillLevel,
    achievements: newAchievements,
    lastActive: new Date().toISOString()
  };
}

function calculateSkillPoints(result: GameResult): number {
  let points = 0;

  // Base points for winning/losing
  points += result.won ? 0.2 : 0.05;

  // Points based on score
  points += Math.min(0.3, result.score / 1000);

  // Points based on reaction time
  const avgReactionTime = result.reactionTimes.reduce((a, b) => a + b, 0) / result.reactionTimes.length;
  if (avgReactionTime < 200) points += 0.3;
  else if (avgReactionTime < 300) points += 0.2;
  else if (avgReactionTime < 400) points += 0.1;

  return points;
}

function checkNewAchievements(stats: PlayerStats, result: GameResult): Achievement[] {
  const newAchievements: Achievement[] = [];
  const existingIds = new Set(stats.achievements.map(a => a.id));

  // First Win Achievement
  if (result.won && !existingIds.has('first-win')) {
    newAchievements.push({
      id: 'first-win',
      name: 'First Victory',
      description: 'Won your first game!',
      unlockedAt: new Date().toISOString(),
      icon: 'trophy'
    });
  }

  // Quick Reflexes Achievement
  const hasQuickReflexes = result.reactionTimes.some(time => time < 200);
  if (hasQuickReflexes && !existingIds.has('quick-reflexes')) {
    newAchievements.push({
      id: 'quick-reflexes',
      name: 'Lightning Fast',
      description: 'Achieved a reaction time under 200ms',
      unlockedAt: new Date().toISOString(),
      icon: 'zap'
    });
  }

  // High Score Achievement
  if (result.score > 1000 && !existingIds.has('high-scorer')) {
    newAchievements.push({
      id: 'high-scorer',
      name: 'High Scorer',
      description: 'Scored over 1000 points in a single game',
      unlockedAt: new Date().toISOString(),
      icon: 'target'
    });
  }

  return newAchievements;
}