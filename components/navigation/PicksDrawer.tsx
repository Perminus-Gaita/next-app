"use client";
import { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { usePicksStore } from "@/lib/stores/picks-store";
import { X, ScrollText, Trash2, AlertCircle, Loader2, Save } from "lucide-react";

const PicksDrawer = () => {
  const { picks, isDrawerOpen, isStrategyRunning, removePick, clearPicks, closeDrawer } = usePicksStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"single" | "all" | null>(null);
  const [pickToRemove, setPickToRemove] = useState<string | null>(null);

  // Track previous picks count for auto-scroll
  const prevPicksCount = useRef(picks.length);

  useEffect(() => {
    setPortalElement(document.body);
  }, []);

  // Auto-scroll to bottom when new picks arrive during strategy
  useEffect(() => {
    if (picks.length > prevPicksCount.current && isStrategyRunning) {
      // Scroll the content area to the bottom smoothly
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
    prevPicksCount.current = picks.length;
  }, [picks.length, isStrategyRunning]);

  const handleClose = () => {
    if (isStrategyRunning) return; // Don't close during strategy
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

  const handleSavePicks = () => {
    console.log("Saving picks:", picks);
    alert("Picks saved! (This is dummy data)");
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
          style={{ position: 'fixed' }}
        />
      )}

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className={`
          fixed top-12 right-0 h-[calc(100vh-49px)] z-50
          border-l border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          transition-transform duration-300 ease-in-out
          ${getWidth()}
          ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}
          shadow-lg overflow-hidden flex flex-col
        `}
        style={{
          position: 'fixed',
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          willChange: 'transform'
        }}
        aria-hidden={!isDrawerOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">PICKSLIP: {picks.length}</h2>
          </div>
          <div className="flex items-center">
            {picks.length > 0 && !isStrategyRunning && (
              <button
                onClick={confirmClearPicks}
                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 mr-2 text-red-500"
                title="Clear all picks"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            {!isStrategyRunning && (
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Strategy Running Indicator - sticky below header */}
        {isStrategyRunning && (
          <div className="px-4 py-2.5 bg-primary/10 border-b border-primary/20 flex items-center gap-2 shrink-0">
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
            <span
              className="text-sm font-semibold text-primary"
              style={{ animation: 'strategyPulse 1.5s ease-in-out infinite' }}
            >
              Strategy running...
            </span>
          </div>
        )}

        {/* Inline Confirmation Modal */}
        {isModalOpen && (
          <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 z-10 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-[90%] max-w-70 shadow-lg border border-gray-200 dark:border-gray-700">
              {modalType === "single" && (
                <>
                  <div className="flex items-center mb-3">
                    <AlertCircle className="text-yellow-500 h-5 w-5 mr-2 shrink-0" />
                    <h3 className="text-base font-bold">Confirm Removal</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Are you sure you want to remove &ldquo;{getPickEventName()}&rdquo; from your picks?
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={closeModal}
                      className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRemovePick}
                      className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
              {modalType === "all" && (
                <>
                  <div className="flex items-center mb-3">
                    <AlertCircle className="text-yellow-500 h-5 w-5 mr-2 shrink-0" />
                    <h3 className="text-base font-bold">Clear All Picks</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Are you sure you want to clear all picks from your pickslip?
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={closeModal}
                      className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearAllPicks}
                      className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                    >
                      Clear All
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Scrollable content area */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto pickslip-content"
        >
          <div className="p-4">
            {picks.length === 0 && !isStrategyRunning ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-2">Your pickslip is empty</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Add some picks to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {picks.map((pick, index) => (
                  <div
                    key={pick.id}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-in fade-in slide-in-from-right-4 duration-300"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-sm">Match {pick.eventNumber}</span>
                      {!isStrategyRunning && (
                        <button
                          onClick={() => confirmRemovePick(pick.id)}
                          className="text-red-500 text-sm hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {pick.homeTeam} vs {pick.awayTeam}
                    </div>

                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-sm">
                        {pick.competition}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Pick: {pick.selection}</span>
                      <span className="font-bold">Odds: {pick.odds.toFixed(2)}</span>
                    </div>
                  </div>
                ))}

                {/* Spacer that shrinks as picks fill in - gives the "filling up" feel */}
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
        </div>

        {/* Sticky Save Picks button at bottom - only after strategy finishes */}
        {!isStrategyRunning && picks.length > 0 && (
          <div className="shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <button
              onClick={handleSavePicks}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              <Save className="w-4 h-4" />
              Save Picks
            </button>
          </div>
        )}
      </aside>
    </>,
    portalElement
  );
};

export default PicksDrawer;
