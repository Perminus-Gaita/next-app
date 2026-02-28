// Jackpot Types
export interface JackpotEvent {
  eventNumber: number;
  competitorHome: string;
  competitorAway: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  result?: "1" | "X" | "2";
  score?: {
    home: number;
    away: number;
  };
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
  jackpotStatus: "Open" | "Closed" | "Finished";
  isLatest: boolean;
  finished: string;
  openedAt?: string;
  bettingClosesAt: string;
  events: JackpotEvent[];
  prizes: JackpotPrize[];
  finishedGames?: number;
}

// Prediction Types
export interface PredictionPick {
  gameNumber: number;
  pick: "1" | "X" | "2";
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

// Comment Types
export interface Comment {
  _id: string;
  jackpotId: string;
  userId: string;
  username?: string;
  text: string;
  votes?: number;
  parentId?: string | null;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

// Statistics Types
export interface Statistics {
  homeWins: number;
  draws: number;
  awayWins: number;
  averageHomeOdds: number;
  averageDrawOdds: number;
  averageAwayOdds: number;
  totalMatches: number;
}

// Local Pick Type (for UI state)
export type LocalPick = "Home" | "Draw" | "Away";

export interface LocalPicks {
  [eventNumber: number]: LocalPick;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// Hook Return Types
export interface UseJackpotDetailsReturn {
  data: Jackpot | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UsePredictionsReturn {
  predictions: Prediction[];
  userPrediction: Prediction | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  createPrediction: (picks: PredictionPick[]) => Promise<Prediction | null>;
  updatePrediction: (
    predictionId: string,
    picks: PredictionPick[]
  ) => Promise<Prediction | null>;
  deletePrediction: (predictionId: string) => Promise<boolean>;
}

export interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  createComment: (text: string) => Promise<Comment | null>;
  deleteComment: (commentId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export interface UseStatisticsReturn {
  stats: Statistics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Tab Types
export type TabType = "matches" | "predictions" | "stats" | "comments";

// SEO Types
export interface JackpotJsonLd {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  offers?: {
    "@type": string;
    price: string;
    priceCurrency: string;
  };
}
