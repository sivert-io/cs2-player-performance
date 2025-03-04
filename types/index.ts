import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Game = {
  enemyTeamSteam64Ids: string[];
  isCompletedLongMatch: boolean;
  ownTeamSteam64Ids: string[];
  ownTeamTotalLeetifyRatingRounds: Record<string, number>;
  ownTeamTotalLeetifyRatings: Record<string, number>;
  ctLeetifyRating: number;
  ctLeetifyRatingRounds: number;
  dataSource: string;
  elo: number | null;
  gameFinishedAt: string; // ISO date string
  gameId: string;
  isCs2: boolean;
  mapName: string;
  matchResult: "win" | "loss" | "draw"; // Adjust based on possible values
  rankType: number;
  scores: [number, number]; // Tuple for two scores
  skillLevel: number;
  tLeetifyRating: number;
  tLeetifyRatingRounds: number;
  deaths: number;
  hasBannedPlayer: boolean;
  kills: number;
  partySize: number;
};

export type PlayerStats = {
  aim: number;
  leetifyRatingRounds: number;
  positioning: number;
  utility: number;
  gamesPlayed: number;
  clutch: number;
  ctLeetify: number;
  leetify: number;
  opening: number;
  tLeetify: number;
};

export type PlayerProfile = {
  bannerBorderId: string;
  name: string;
  steam64Id: string;
  steamAvatarUrl: string;
  isCollector: boolean;
  isLeetifyStaff: boolean;
  isProPlan: boolean;
  leetifyUserId: string;
  vanityUrl: string | null;
  esportalNickname: string;
  faceitNickname: string;
  platformBans: string[]; // Assuming an array of strings; adjust type if needed
};

export interface Player {
  stats: {
    recentGameRatings: PlayerStats;
    meta: PlayerProfile;
    games: Game[];
  };
  totalScore: number;
  roles: string[];
}
