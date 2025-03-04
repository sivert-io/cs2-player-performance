import { Player } from "@/types";

type PlayerStats = {
  currentRating: number;
  aim: number;
  clutch: number;
  opening: number;
  positioning: number;
  utility: number;
};

export type Team = {
  players: Player[];
  totalScore: number;
};

export function determinePlayerProfile(stats: PlayerStats) {
  const { aim, clutch, opening, positioning, utility } = stats;

  // Normalizing values (assuming max observed value is around 100 for reference)
  const normalizedAim = aim / 100;
  const normalizedClutch = clutch / 1; // Clutch values are usually very low
  const normalizedOpening = opening / 1; // Entry fragging also low
  const normalizedPositioning = positioning / 100;
  const normalizedUtility = utility / 100;

  // Determine primary role(s) based on highest stats
  const roles: string[] = [];
  if (normalizedOpening > 0.05 && normalizedAim > 0.6)
    roles.push("Entry Fragger");

  if (normalizedUtility > 0.6 && normalizedPositioning > 0.4)
    roles.push("Support");

  if (normalizedAim > 0.7 && normalizedPositioning > 0.5) roles.push("Rifler");

  if (normalizedClutch > 0.15) roles.push("Clutch Player");

  if (normalizedPositioning > 0.7 && normalizedAim < 0.5) roles.push("Lurker");

  if (normalizedAim > 0.8 && normalizedOpening > 0.03) roles.push("AWPer");

  if (roles.length === 0) roles.push("Flexible"); // If no strong category fits

  // Calculate total score based on a weighted average
  const totalScore =
    aim * 4 + clutch * 100 + opening * 100 + positioning * 3 + utility * 2;

  return {
    roles,
    totalScore: Math.round(totalScore * 10), // Round score for easier comparison
  };
}
export function createBalancedTeams(players: Player[], teamSize = 5): Team[] {
  // Copy and sort players by totalScore (descending order)
  const sortedPlayers = [...players].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  // Determine the number of complete teams
  const numTeams = Math.floor(sortedPlayers.length / teamSize);
  if (numTeams < 1) {
    throw new Error("Not enough players to form a full team.");
  }

  // Slice the list to only take complete teams worth of players
  const validPlayers = sortedPlayers.slice(0, numTeams * teamSize);

  // Initialize empty teams
  const teams: Team[] = Array.from({ length: numTeams }, () => ({
    players: [],
    totalScore: 0,
  }));

  // Distribute players using a round-robin balance strategy
  for (const player of validPlayers) {
    // Find the team with the **lowest total score** and assign the player there
    teams.sort((a, b) => a.totalScore - b.totalScore);
    teams[0].players.push(player);
    teams[0].totalScore += player.totalScore;
  }

  return teams;
}

export function getCurrentRating(player: Player) {
  // go through each game until we find a game with a skill level and return it
  for (const game of player.stats.games) {
    if (game.skillLevel && game.rankType === 11) return game.skillLevel;
  }
}
