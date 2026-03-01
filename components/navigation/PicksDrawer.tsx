"use client";
import { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { usePicksStore } from "@/lib/stores/picks-store";
import { X, ScrollText, Trash2, AlertCircle, Loader2, Save, CheckCircle2 } from "lucide-react";

const MIN_PICKS_TO_WIN = 13;

const PicksDrawer = () => {
  const { picks, jackpotId, totalEvents, isDrawerOpen, isStrategyRunning, removePick, clearPicks, closeDrawer } = usePicksStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"single" | "all" | null>(null);

  // Pick name for saving
  const [pickName, setPickName] = useState("");
  const [pickToRemove, setPickToRemove] = useState<string | null>(null);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Track previous picks count for auto-scroll
  const prevPicksCount = useRef(picks.length);

  const canSave = picks.length >= MIN_PICKS_TO_WIN && pickName.trim().length > 0 && !isSaving;
  const picksNeeded = MIN_PICKS_TO_WIN - picks.length;

  useEffect(() => {
    setPortalElement(document.body);
  }, []);

  // Auto-scroll to bottom when new picks arrive during strategy
  useEffect(() => {
    if (picks.length > prevPicksCount.current && isStrategyRunning) {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
    prevPicksCount.current = picks.length;
  }, [picks.length, isStrategyRunning]);

  // Clear success message after a delay
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleClose = () => {
    if (isStrategyRunning) return;
    if (isModalOpen) {
      closeModal();
      return;
    }
    closeDrawer();
  };

  const confirmRemovePick = (pickId: string) => {
    if (isStrategyRunning) return;
    setModalType("single");
    setPickToRemove(pickId);
    setIsModalOpen(true);
  };

  const confirmClearPicks = () => {
    if (isStrategyRunning) return;
    setModalType("all");
    setIsModalOpen(true);
  };

  const handleRemovePick = () => {
    if (pickToRemove) {
      removePick(pickToRemove);
    }
    closeModal();
  };

  const handleClearAllPicks = () => {
    clearPicks();
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPickToRemove(null);
    setModalType(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        if (!isModalOpen && !isStrategyRunning) {
          handleClose();
        }
      }
    };

    if (isDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen, isModalOpen, isStrategyRunning]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const getWidth = () => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return "w-[80%]";
    }
    return "w-[320px]";
  };

  const getPickEventName = () => {
    if (!pickToRemove) return "";
    const pick = picks.find(p => p.id === pickToRemove);
    return pick ? `${pick.homeTeam} vs ${pick.awayTeam}` : "";
  };

  const handleSavePicks = async () => {
    if (!canSave || !jackpotId) {
      if (!jackpotId) {
        setSaveError("No jackpot selected. Please pick matches first.");
      }
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Map picks to the API format
      const apiPicks = picks.map(p => ({
        gameNumber: p.eventNumber,
        pick: p.selection, // "Home", "Draw", "Away" — the API handler maps these
      }));

      const res = await fetch(`/api/jackpots/${jackpotId}/picks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: pickName.trim(), picks: apiPicks }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save picks");
      }

      setSaveSuccess(true);
      setPickName("");
      // Clear picks after successful save
      clearPicks();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save picks. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!portalElement) return null;

  return ReactDOM.createPortal(
    <>
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .pickslip-content::-webkit-scrollbar {
          width: 6px;
        }
        .pickslip-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .pickslip-content::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .pickslip-content::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.7);
        }
        .pickslip-content {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        .dark .pickslip-content::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
        }
        .dark .pickslip-content::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.7);
        }
        .dark .pickslip-content {
          scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
        }

        @keyframes strategyPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={isModalOpen || isStrategyRunning ? undefined : handleClose}
        />
      )}

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full ${getWidth()} bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h2 className="font-bold text-gray-900 dark:text-white">Pick Slip</h2>
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {picks.length}{totalEvents > 0 ? `/${totalEvents}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {picks.length > 0 && !isStrategyRunning && (
              <button
                onClick={confirmClearPicks}
                className="text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Clear all
              </button>
            )}
            <button
              onClick={handleClose}
              disabled={isStrategyRunning}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pickslip-content" ref={contentRef}>
          {picks.length === 0 && !isStrategyRunning ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <ScrollText className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No picks yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Select Home, Draw or Away on match cards
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {/* Strategy running indicator */}
              {isStrategyRunning && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium" style={{ animation: 'strategyPulse 2s infinite' }}>
                    Running strategy...
                  </span>
                </div>
              )}

              {picks.map((pick) => (
                <div
                  key={pick.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        #{pick.eventNumber}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {pick.competition}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {pick.homeTeam} vs {pick.awayTeam}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-primary">
                        {pick.selection === "Home" ? "1" : pick.selection === "Draw" ? "X" : "2"} — {pick.selection}
                      </span>
                      <span className="text-xs text-muted-foreground">@{pick.odds.toFixed(2)}</span>
                    </div>
                  </div>

                  {!isStrategyRunning && (
                    <button
                      onClick={() => confirmRemovePick(pick.id)}
                      className="ml-2 p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {/* Spacer that shrinks as picks fill in */}
              {isStrategyRunning && (
                <div
                  className="transition-all duration-500 ease-out"
                  style={{ minHeight: `${Math.max(0, 300 - picks.length * 25)}px` }}
                />
              )}

              {/* Scroll anchor */}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Sticky Save Picks button at bottom - only after strategy finishes */}
        {!isStrategyRunning && picks.length > 0 && (
          <div className="shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {/* Minimum picks warning */}
            {picks.length < MIN_PICKS_TO_WIN && (
              <div className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-3">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    Need at least {MIN_PICKS_TO_WIN} picks to save
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                    You need {picksNeeded} more pick{picksNeeded !== 1 ? 's' : ''}. You must pick at least {MIN_PICKS_TO_WIN} of {totalEvents || '17'} games to be eligible for a prize.
                  </p>
                </div>
              </div>
            )}

            {/* Save error */}
            {saveError && (
              <div className="flex items-start gap-2 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 dark:text-red-400">{saveError}</p>
              </div>
            )}

            {/* Save success */}
            {saveSuccess && (
              <div className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-3">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">Picks saved successfully!</p>
              </div>
            )}

            <div className="mb-3">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Pick Name</label>
              <input
                type="text"
                value={pickName}
                onChange={(e) => setPickName(e.target.value)}
                placeholder="e.g. Safe Home Favorites"
                maxLength={100}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <button
              onClick={handleSavePicks}
              disabled={!canSave}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                canSave
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Picks ({picks.length}/{totalEvents || '?'})
                </>
              )}
            </button>
          </div>
        )}

        {/* Confirmation Modal */}
        {isModalOpen && (
          <div className="absolute inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 max-w-sm w-full shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {modalType === "all" ? "Clear all picks?" : "Remove pick?"}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {modalType === "all"
                  ? "This will remove all picks from your slip."
                  : `Remove ${getPickEventName()}?`}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={modalType === "all" ? handleClearAllPicks : handleRemovePick}
                  className="flex-1 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  {modalType === "all" ? "Clear All" : "Remove"}
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>,
    portalElement
  );
};

export default PicksDrawer;
