export interface JackpotEvent {
  eventNumber: number;
  competitorHome: string;
  competitorAway: string;
  odds: { home: number; draw: number; away: number };
  result?: '1' | 'X' | '2';
  score?: { home: number; away: number };
  kickoffTime: string;
  competition: string;
}

export interface JackpotPrize {
  jackpotType: string;
  prize: number;
  winners: number;
}

export interface Jackpot {
  _id: string;
  jackpotHumanId: string;
  site: string;
  totalPrizePool: number;
  currencySign: string;
  jackpotStatus: 'Open' | 'Closed' | 'Finished';
  isLatest: boolean;
  finished: string;
  bettingClosesAt: string;
  finishedGames?: number;
  events: JackpotEvent[];
  prizes: JackpotPrize[];
}

export interface PredictionPick {
  gameNumber: number;
  pick: '1' | 'X' | '2';
}

export interface Prediction {
  _id: string;
  jackpotId: string;
  userId: string;
  username?: string;
  picks: PredictionPick[];
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  jackpotId: string;
  userId: string;
  username?: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface Statistics {
  homeWins: number;
  draws: number;
  awayWins: number;
  averageHomeOdds: number;
  averageDrawOdds: number;
  averageAwayOdds: number;
  totalMatches: number;
}

export type LocalPick = 'Home' | 'Draw' | 'Away';

export interface LocalPicks {
  [eventNumber: number]: LocalPick;
}

export type TabType = 'matches' | 'predictions' | 'stats' | 'comments' | 'strategies';
