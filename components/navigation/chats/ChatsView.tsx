"use client";
import { useState } from "react";
import { MessagesSquare, Plus, Search, X, Trash2, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

interface ChatsViewProps {
  openLeftSidebar: boolean;
  onClose: () => void;
}

// Dummy chat data
const DUMMY_CHATS: Chat[] = [
  {
    id: "1",
    title: "Betting Strategy Analysis",
    preview: "Can you help me analyze the latest jackpot patterns?",
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    title: "Match Predictions for Weekend",
    preview: "What are the predictions for this weekend's matches?",
    timestamp: "5 hours ago"
  },
  {
    id: "3",
    title: "Statistics Review",
    preview: "Show me the statistics for the last 10 jackpots",
    timestamp: "Yesterday"
  },
  {
    id: "4",
    title: "Odds Comparison",
    preview: "Compare the odds between different bookmakers",
    timestamp: "2 days ago"
  },
  {
    id: "5",
    title: "Team Performance Analysis",
    preview: "How has Manchester United performed this season?",
    timestamp: "3 days ago"
  },
  {
    id: "6",
    title: "Jackpot Tips and Strategies",
    preview: "Give me some tips for the mega jackpot",
    timestamp: "4 days ago"
  },
  {
    id: "7",
    title: "Historical Data Analysis",
    preview: "What does the historical data show about home wins?",
    timestamp: "1 week ago"
  }
];

export default function ChatsView({ openLeftSidebar, onClose }: ChatsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [chats, setChats] = useState<Chat[]>(DUMMY_CHATS);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null);

  const filteredChats = chats.filter(
    chat =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    console.log("Creating new chat...");
    onClose();
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    setMenuOpenChatId(null);
  };

  const handleChatClick = (chatId: string) => {
    console.log("Opening chat:", chatId);
    onClose();
  };

  const handleSearchClick = () => {
    setShowSearchInput(!showSearchInput);
    if (showSearchInput) {
      setSearchQuery("");
    }
  };

  const handleMenuToggle = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenChatId(menuOpenChatId === chatId ? null : chatId);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <MessagesSquare className="h-5 w-5 text-gray-700 dark:text-gray-300 shrink-0" />
          <span 
            className={cn(
              "text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap transition-all duration-300 ease-in-out",
              openLeftSidebar 
                ? "opacity-100 max-w-xs" 
                : "opacity-0 max-w-0"
            )}
          >
            Chats
          </span>
        </div>
        <button
          onClick={onClose}
          className={cn(
            "p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded shrink-0 transition-all duration-300 ease-in-out",
            openLeftSidebar 
              ? "opacity-100" 
              : "opacity-0 pointer-events-none"
          )}
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* New Chat & Search Buttons */}
      <div className="py-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={handleNewChat}
          className={cn(
            "w-full flex items-center justify-start h-12 text-sm font-medium overflow-hidden",
            "text-gray-700 dark:text-gray-300",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "transition-all duration-300 ease-in-out",
            openLeftSidebar ? "px-3" : "pl-5.5"
          )}
        >
          <Plus className="h-5 w-5 shrink-0" />
          <span 
            className={cn(
              "whitespace-nowrap transition-all duration-300 ease-in-out",
              openLeftSidebar 
                ? "opacity-100 ml-3 max-w-xs" 
                : "opacity-0 ml-0 max-w-0"
            )}
          >
            New Chat
          </span>
        </button>

        <button
          onClick={handleSearchClick}
          className={cn(
            "w-full flex items-center justify-start h-12 text-sm font-medium overflow-hidden",
            "text-gray-700 dark:text-gray-300",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "transition-all duration-300 ease-in-out",
            openLeftSidebar ? "px-3" : "pl-5.5"
          )}
        >
          <Search className="h-5 w-5 shrink-0" />
          <span 
            className={cn(
              "whitespace-nowrap transition-all duration-300 ease-in-out",
              openLeftSidebar 
                ? "opacity-100 ml-3 max-w-xs" 
                : "opacity-0 ml-0 max-w-0"
            )}
          >
            Search
          </span>
        </button>
      </div>

      {/* Search Input */}
      <div 
        className={cn(
          "border-b border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 ease-in-out",
          showSearchInput && openLeftSidebar 
            ? "max-h-20 p-3" 
            : "max-h-0 p-0"
        )}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg 
                     border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-800
                     text-gray-900 dark:text-gray-100
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chats List - Smooth transitions */}
      <div 
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out",
          openLeftSidebar ? "opacity-100" : "opacity-0"
        )}
      >
        <div 
          className={cn(
            "py-1 transition-all duration-300 ease-in-out",
            openLeftSidebar ? "max-h-full" : "max-h-0 overflow-hidden"
          )}
        >
          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No chats found
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
                onClick={() => handleChatClick(chat.id)}
                className="relative px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 
                         cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm text-gray-900 dark:text-white truncate flex-1">
                    {chat.title}
                  </h3>
                  {hoveredChatId === chat.id && (
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => handleMenuToggle(chat.id, e)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 
                                 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                                 rounded transition-colors"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                      
                      {/* Dropdown menu */}
                      {menuOpenChatId === chat.id && (
                        <div className="absolute right-0 top-full mt-1 z-10 
                                      bg-white dark:bg-gray-800 
                                      border border-gray-200 dark:border-gray-700 
                                      rounded-lg shadow-lg py-1 min-w-30">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat.id);
                            }}
                            className="w-full px-3 py-2 text-left text-sm 
                                     text-red-600 dark:text-red-400 
                                     hover:bg-red-50 dark:hover:bg-red-900/20 
                                     transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer - Smooth transitions */}
      <div 
        className={cn(
          "border-t border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 ease-in-out",
          openLeftSidebar 
            ? "max-h-20 opacity-100" 
            : "max-h-0 opacity-0"
        )}
      >
        <div className="p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center whitespace-nowrap">
            {chats.length} {chats.length === 1 ? 'chat' : 'chats'}
          </p>
        </div>
      </div>
    </div>
  );
}
