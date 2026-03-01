"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface JackpotErrorProps {
  error: string | null;
  onRetry: () => void;
}

const JackpotError: React.FC<JackpotErrorProps> = ({ error, onRetry }) => (
  <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load jackpot</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {error || "Something went wrong. Please try again."}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  </div>
);

export default JackpotError;
