#!/bin/bash

# Navigate to project root (adjust if needed)
cd "$(dirname "$0")"

echo "🚀 Creating TypeScript files for features/jackpots..."

# ============================================
# types/index.ts
# ============================================
cat > features/jackpots/types/index.ts << 'EOF'
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
  result?: '1' | 'X' | '2';
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
  jackpotStatus: 'Open' | 'Closed' | 'Finished';
  isLatest: boolean;
  finished: string;
  bettingClosesAt: string;
  events: JackpotEvent[];
  prizes: JackpotPrize[];
}

// Prediction Types
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

// Comment Types
export interface Comment {
  _id: string;
  jackpotId: string;
  userId: string;
  username?: string;
  text: string;
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
export type LocalPick = 'Home' | 'Draw' | 'Away';

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
  updatePrediction: (predictionId: string, picks: PredictionPick[]) => Promise<Prediction | null>;
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
export type TabType = 'matches' | 'predictions' | 'stats' | 'comments';

// SEO Types
export interface JackpotJsonLd {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  offers?: {
    '@type': string;
    price: string;
    priceCurrency: string;
  };
}
EOF

echo "✅ Created types/index.ts"

# ============================================
# utils/helpers.ts
# ============================================
cat > features/jackpots/utils/helpers.ts << 'EOF'
import type { Jackpot, JackpotJsonLd } from '../types';

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // If within the last week, show relative time
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  // Otherwise show formatted date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Format currency with thousand separators
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE').format(Math.round(amount));
}

/**
 * Format full currency amount
 * @param amount - Amount to format
 * @returns Formatted full amount string
 */
export function formatFullAmount(amount: number): string {
  return new Intl.NumberFormat('en-KE').format(Math.round(amount));
}

/**
 * Convert local pick ('Home', 'Draw', 'Away') to API format ('1', 'X', '2')
 * @param pick - Local pick
 * @returns API pick format
 */
export function convertToApiPick(pick: 'Home' | 'Draw' | 'Away'): '1' | 'X' | '2' {
  if (pick === 'Home') return '1';
  if (pick === 'Draw') return 'X';
  return '2';
}

/**
 * Convert API pick ('1', 'X', '2') to local format ('Home', 'Draw', 'Away')
 * @param pick - API pick
 * @returns Local pick format
 */
export function convertToLocalPick(pick: '1' | 'X' | '2'): 'Home' | 'Draw' | 'Away' {
  if (pick === '1') return 'Home';
  if (pick === 'X') return 'Draw';
  return 'Away';
}

/**
 * Calculate time remaining until jackpot closes
 * @param closingDate - ISO date string of when betting closes
 * @returns Object with days, hours, and minutes remaining
 */
export function getTimeRemaining(closingDate: string): { days: number; hours: number; minutes: number; isExpired: boolean } {
  const now = new Date().getTime();
  const closing = new Date(closingDate).getTime();
  const diff = closing - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, isExpired: false };
}

/**
 * Generate JSON-LD structured data for SEO
 * @param jackpot - Jackpot data
 * @returns JSON-LD object
 */
export function generateJackpotJsonLd(jackpot: Jackpot): JackpotJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${jackpot.site} Mega Jackpot Pro ${jackpot.events.length} #${jackpot.jackpotHumanId}`,
    description: `Track SportPesa Mega Jackpot results, view match outcomes, and share predictions. Prize pool: ${jackpot.currencySign} ${formatFullAmount(jackpot.totalPrizePool)}`,
    startDate: jackpot.events[0]?.kickoffTime || new Date().toISOString(),
    endDate: jackpot.bettingClosesAt,
    ...(jackpot.totalPrizePool && {
      offers: {
        '@type': 'Offer',
        price: jackpot.totalPrizePool.toString(),
        priceCurrency: 'KES',
      },
    }),
  };
}

/**
 * Truncate text to a maximum length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get status color based on jackpot status
 * @param status - Jackpot status
 * @returns Tailwind color class
 */
export function getStatusColor(status: 'Open' | 'Closed' | 'Finished'): string {
  switch (status) {
    case 'Open':
      return 'text-green-500 bg-green-500/20';
    case 'Closed':
      return 'text-yellow-500 bg-yellow-500/20';
    case 'Finished':
      return 'text-muted-foreground bg-muted';
    default:
      return 'text-muted-foreground bg-muted';
  }
}
EOF

echo "✅ Created utils/helpers.ts"

# ============================================
# utils/constants.ts
# ============================================
cat > features/jackpots/utils/constants.ts << 'EOF'
import type { TabType } from '../types';

/**
 * Available tabs in the jackpot tracker
 */
export const TABS: { id: TabType; label: string }[] = [
  { id: 'matches', label: 'Matches' },
  { id: 'predictions', label: 'Predictions' },
  { id: 'stats', label: 'Stats' },
  { id: 'comments', label: 'Comments' },
];

/**
 * Pick options for betting
 */
export const PICK_OPTIONS = ['Home', 'Draw', 'Away'] as const;

/**
 * API pick format
 */
export const API_PICKS = ['1', 'X', '2'] as const;

/**
 * Maximum characters for comments
 */
export const MAX_COMMENT_LENGTH = 500;

/**
 * Prediction update debounce time in ms
 */
export const PREDICTION_DEBOUNCE_TIME = 500;

/**
 * Default jackpot ID (for latest jackpot)
 */
export const DEFAULT_JACKPOT_ID = 'latest';

/**
 * Animation durations (in ms)
 */
export const ANIMATION = {
  FADE_IN: 200,
  SLIDE_IN: 300,
  BOUNCE: 400,
} as const;

/**
 * Jackpot status values
 */
export const JACKPOT_STATUS = {
  OPEN: 'Open',
  CLOSED: 'Closed',
  FINISHED: 'Finished',
} as const;

/**
 * Colors for different stats
 */
export const STAT_COLORS = {
  HOME: {
    bg: 'bg-green-500',
    text: 'text-green-950',
    border: 'border-green-500',
  },
  DRAW: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-950',
    border: 'border-yellow-500',
  },
  AWAY: {
    bg: 'bg-blue-500',
    text: 'text-blue-950',
    border: 'border-blue-500',
  },
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  FAILED_TO_LOAD: 'Failed to load jackpot',
  FAILED_TO_SAVE: 'Failed to save prediction',
  FAILED_TO_COMMENT: 'Failed to post comment',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC: 'Something went wrong. Please try again.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  PREDICTION_SAVED: 'Prediction saved successfully!',
  COMMENT_POSTED: 'Comment posted successfully!',
  DELETED: 'Deleted successfully!',
} as const;

/**
 * Cache times (in seconds)
 */
export const CACHE_TIME = {
  JACKPOT_DETAILS: 60,
  PREDICTIONS: 30,
  COMMENTS: 10,
  STATISTICS: 60,
} as const;

/**
 * SEO Meta data defaults
 */
export const SEO_DEFAULTS = {
  SITE_NAME: 'Wufwuf',
  BASE_URL: 'https://wufwuf.io',
  TWITTER_HANDLE: '@Wufwuf',
  DEFAULT_IMAGE: '/og-jackpot.png',
} as const;
EOF

echo "✅ Created utils/constants.ts"

# ============================================
# hooks/useJackpotApi.ts
# ============================================
cat > features/jackpots/hooks/useJackpotApi.ts << 'EOF'
"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Jackpot,
  Prediction,
  PredictionPick,
  Comment,
  Statistics,
  UseJackpotDetailsReturn,
  UsePredictionsReturn,
  UseCommentsReturn,
  UseStatisticsReturn,
  ApiResponse,
} from "../types";

// Base API URL - points to our Next.js API routes
const API_BASE = "/api/jackpot";

/**
 * Custom hook for fetching jackpot details
 * @param jackpotId - The jackpot ID or "latest" to fetch the most recent jackpot
 */
export function useJackpotDetails(jackpotId: string): UseJackpotDetailsReturn {
  const [data, setData] = useState<Jackpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!jackpotId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE}/details`;

      if (jackpotId !== "latest") {
        url += `?jackpotId=${jackpotId}`;
      } else {
        url += `?limit=1`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Jackpot | Jackpot[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch jackpot details");
      }

      const jackpotData = Array.isArray(result.data)
        ? result.data[0]
        : result.data;

      if (!jackpotData) {
        throw new Error("No jackpot found");
      }

      setData(jackpotData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [jackpotId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { data, loading, error, refetch: fetchDetails };
}

/**
 * Custom hook for fetching and managing predictions
 * @param jackpotId - The jackpot ID (MongoDB ObjectId)
 */
export function usePredictions(jackpotId?: string): UsePredictionsReturn {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [userPrediction, setUserPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPredictions = useCallback(async () => {
    if (!jackpotId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/picks?jackpotId=${jackpotId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Prediction[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch predictions");
      }

      setPredictions(result.data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jackpotId]);

  const fetchUserPrediction = useCallback(async () => {
    if (!jackpotId) return;

    try {
      const response = await fetch(
        `${API_BASE}/picks?jackpotId=${jackpotId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Prediction[]> = await response.json();

      if (result.success && result.data?.length > 0) {
        setUserPrediction(result.data[0]);
      }
    } catch (err) {
      console.error("Error fetching user prediction:", err);
    }
  }, [jackpotId]);

  const createPrediction = useCallback(
    async (picks: PredictionPick[]): Promise<Prediction | null> => {
      if (!jackpotId) return null;

      try {
        setSubmitting(true);
        const response = await fetch(`${API_BASE}/picks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jackpotId, picks }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse<Prediction> = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to create prediction");
        }

        setUserPrediction(result.data);
        await fetchPredictions();
        return result.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [jackpotId, fetchPredictions]
  );

  const updatePrediction = useCallback(
    async (predictionId: string, picks: PredictionPick[]): Promise<Prediction | null> => {
      try {
        setSubmitting(true);
        const response = await fetch(`${API_BASE}/picks`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ predictionId, picks }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse<Prediction> = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to update prediction");
        }

        setUserPrediction(result.data);
        await fetchPredictions();
        return result.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchPredictions]
  );

  const deletePrediction = useCallback(
    async (predictionId: string): Promise<boolean> => {
      try {
        setSubmitting(true);
        const response = await fetch(`${API_BASE}/picks`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ predictionId }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse<{ deleted: boolean }> = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to delete prediction");
        }

        setUserPrediction(null);
        await fetchPredictions();
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchPredictions]
  );

  useEffect(() => {
    if (jackpotId) {
      fetchPredictions();
      fetchUserPrediction();
    }
  }, [jackpotId, fetchPredictions, fetchUserPrediction]);

  return {
    predictions,
    userPrediction,
    loading,
    error,
    submitting,
    createPrediction,
    updatePrediction,
    deletePrediction,
  };
}

/**
 * Custom hook for fetching and managing comments
 * @param jackpotId - The jackpot ID (MongoDB ObjectId)
 */
export function useComments(jackpotId?: string): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!jackpotId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/comments?jackpotId=${jackpotId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Comment[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch comments");
      }

      setComments(result.data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jackpotId]);

  const createComment = useCallback(
    async (text: string): Promise<Comment | null> => {
      if (!jackpotId) return null;

      try {
        setSubmitting(true);
        const response = await fetch(`${API_BASE}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jackpotId, text }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse<Comment> = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to create comment");
        }

        setComments((prev) => [result.data, ...prev]);
        return result.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [jackpotId]
  );

  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE}/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<{ deleted: boolean }> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete comment");
      }

      setComments((prev) => prev.filter((c) => c._id !== commentId));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  useEffect(() => {
    if (jackpotId) {
      fetchComments();
    }
  }, [jackpotId, fetchComments]);

  return {
    comments,
    loading,
    error,
    submitting,
    createComment,
    deleteComment,
    refetch: fetchComments,
  };
}

/**
 * Custom hook for fetching statistics
 * @param jackpotId - The jackpot ID (MongoDB ObjectId)
 */
export function useStatistics(jackpotId?: string): UseStatisticsReturn {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!jackpotId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/statistics?jackpotId=${jackpotId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Statistics> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch statistics");
      }

      setStats(result.data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jackpotId]);

  useEffect(() => {
    if (jackpotId) {
      fetchStats();
    }
  }, [jackpotId, fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
EOF

echo "✅ Created hooks/useJackpotApi.ts"

echo ""
echo "🎉 All files created successfully in features/jackpots/"
echo ""
echo "📂 Created files:"
echo "  - types/index.ts"
echo "  - utils/helpers.ts"
echo "  - utils/constants.ts"
echo "  - hooks/useJackpotApi.ts"
echo ""
echo "Next steps:"
echo "1. Copy the component files (coming in next script)"
echo "2. Update your app/(app)/jackpots files"
echo ""