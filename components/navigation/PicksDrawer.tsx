"use client";
import { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { usePicksStore } from "@/lib/stores/picks-store";
import { X, ScrollText, Trash2, AlertCircle } from "lucide-react";

const PicksDrawer = () => {
  const { picks, isDrawerOpen, removePick, clearPicks, closeDrawer } = usePicksStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"single" | "all" | null>(null);
  const [pickToRemove, setPickToRemove] = useState<string | null>(null);
  
  // Initialize portal element on client-side
  useEffect(() => {
    setPortalElement(document.body);
  }, []);
  
  // Close drawer function
  const handleClose = () => {
    // If modal is open, close it first
    if (isModalOpen) {
      closeModal();
      return;
    }
    closeDrawer();
  };

  // Open confirmation modal for removing a single pick
  const confirmRemovePick = (pickId: string) => {
    setModalType("single");
    setPickToRemove(pickId);
    setIsModalOpen(true);
  };

  // Open confirmation modal for clearing all picks
  const confirmClearPicks = () => {
    setModalType("all");
    setIsModalOpen(true);
  };

  // Handle removing a pick after confirmation
  const handleRemovePick = () => {
    if (pickToRemove) {
      removePick(pickToRemove);
    }
    closeModal();
  };

  // Handle clearing all picks after confirmation
  const handleClearAllPicks = () => {
    clearPicks();
    closeModal();
  };
  
  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setPickToRemove(null);
    setModalType(null);
  };
  
  // Handle click outside to close drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        // Only close if modal is not open
        if (!isModalOpen) {
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
  }, [isDrawerOpen, isModalOpen]);

  // Stop body scrolling when drawer is open
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

  // Calculate width based on screen size (matching the left sidebar widths)
  const getWidth = () => {
    // For mobile
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return "w-[80%]";
    }
    // For tablet and desktop
    else {
      return "w-[320px]";
    }
  };

  // Get the pick event name for the confirmation modal
  const getPickEventName = () => {
    if (!pickToRemove) return "";
    const pick = picks.find(p => p.id === pickToRemove);
    return pick ? `${pick.homeTeam} vs ${pick.awayTeam}` : "";
  };

  // Only render if we're in the browser
  if (!portalElement) return null;

  // Render the drawer directly into the body to avoid layout conflicts
  return ReactDOM.createPortal(
    <>
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        /* Custom scrollbar for the pickslip drawer content */
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
        
        /* For Firefox */
        .pickslip-content {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        /* For dark mode */
        .dark .pickslip-content::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
        }
        
        .dark .pickslip-content::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.7);
        }
        
        .dark .pickslip-content {
          scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
        }
      `}</style>

      {/* Overlay for the background - only appears when drawer is open */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={isModalOpen ? undefined : handleClose}
          style={{ position: 'fixed' }}
        />
      )}
      
      {/* Drawer - always exists in DOM but visibility and position controlled by classes */}
      <aside
        ref={drawerRef}
        className={`
          fixed top-12 right-0 h-[calc(100vh-49px)] z-50 
          border-l border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          transition-transform duration-300 ease-in-out
          ${getWidth()}
          ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}
          shadow-lg overflow-hidden
        `}
        style={{ 
          position: 'fixed',
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          willChange: 'transform'
        }}
        aria-hidden={!isDrawerOpen}
      >
        {/* Header with icon */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">PICKSLIP: {picks.length}</h2>
          </div>
          <div className="flex items-center">
            {picks.length > 0 && (
              <button 
                onClick={confirmClearPicks}
                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 mr-2 text-red-500"
                title="Clear all picks"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Inline Confirmation Modal */}
        {isModalOpen && (
          <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 z-10 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-[90%] max-w-70 shadow-lg border border-gray-200 dark:border-gray-700">
              {/* Confirmation for removing a pick */}
              {modalType === "single" && (
                <>
                  <div className="flex items-center mb-3">
                    <AlertCircle className="text-yellow-500 h-5 w-5 mr-2 shrink-0" />
                    <h3 className="text-base font-bold">Confirm Removal</h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Are you sure you want to remove "{getPickEventName()}" from your picks?
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
              
              {/* Confirmation for clearing all picks */}
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
        
        {/* Content with custom scrollbar */}
        <div className="p-4 overflow-y-auto h-[calc(100%-60px)] pickslip-content">
          {picks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">Your pickslip is empty</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Add some picks to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {picks.map((pick) => (
                <div 
                  key={pick.id} 
                  className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-sm">Match {pick.eventNumber}</span>
                    <button 
                      onClick={() => confirmRemovePick(pick.id)}
                      className="text-red-500 text-sm hover:text-red-600"
                    >
                      Remove
                    </button>
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
            </div>
          )}
        </div>
      </aside>
    </>,
    portalElement
  );
};

export default PicksDrawer;
