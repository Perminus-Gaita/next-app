"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Dummy chat history
const DUMMY_CHAT_HISTORY: Record<string, { title: string; messages: Message[] }> = {
  "1": {
    title: "Betting Strategy Analysis",
    messages: [
      { id: "m1", role: "user", content: "Can you help me analyze the latest jackpot patterns?" },
      { id: "m2", role: "assistant", content: "I'd be happy to help analyze jackpot patterns. Based on the last 10 SportPesa Mega Jackpots, here are some key trends:\n\n• Home wins occurred in 52% of matches\n• Draws appeared in about 23% of matches\n• Away wins made up the remaining 25%\n\nWould you like me to break this down by league or look at specific match conditions?" },
      { id: "m3", role: "user", content: "Yes, break it down by league please" },
      { id: "m4", role: "assistant", content: "Here's the breakdown by league from recent jackpots:\n\nPremier League: Home wins 48%, Draws 27%, Away wins 25%\nLa Liga: Home wins 55%, Draws 21%, Away wins 24%\nSerie A: Home wins 51%, Draws 24%, Away wins 25%\nBundesliga: Home wins 49%, Draws 22%, Away wins 29%\n\nLa Liga shows the strongest home advantage, while Bundesliga has the highest away win rate. This could inform your strategy filters." },
    ]
  },
  "2": {
    title: "Match Predictions for Weekend",
    messages: [
      { id: "m1", role: "user", content: "What are the predictions for this weekend's matches?" },
      { id: "m2", role: "assistant", content: "Remember, I don't predict — I help you filter based on your own logic! But I can show you the data for this weekend's jackpot matches.\n\nThere are 17 matches in the upcoming Mega Jackpot. Would you like me to:\n\n1. Show odds overview for all matches\n2. Apply one of your saved strategies\n3. Look at head-to-head records\n\nWhich would be most helpful?" },
    ]
  },
  "3": {
    title: "Statistics Review",
    messages: [
      { id: "m1", role: "user", content: "Show me the statistics for the last 10 jackpots" },
      { id: "m2", role: "assistant", content: "Here are the stats from the last 10 Mega Jackpots:\n\nOverall Results:\n• Total matches analyzed: 170\n• Average home wins per jackpot: 8.9\n• Average draws per jackpot: 3.8\n• Average away wins per jackpot: 4.3\n\nBest performing filter:\nHome odds < 1.50 → 78% accuracy\n\nMost unpredictable league:\nLigue 1 (highest variance in outcomes)\n\nWant me to go deeper into any of these?" },
    ]
  },
};

const greetingPairs = [
  "Hey there!",
  "Hello there!",
  "Hi there!",
  "Good morning!",
  "Welcome back!",
  "Good to see you!",
  "Habari!",
  "Habari yako!",
  "Unasema aje leo!",
];

const exampleQueries = [
  "Show me the winning patterns",
  "What are the draw statistics?",
  "Analyze home team performance",
  "Show outcome distribution",
];

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const isNewChat = chatId === "new";

  const chatData = isNewChat ? null : DUMMY_CHAT_HISTORY[chatId] || null;

  const [messages, setMessages] = useState<Message[]>(chatData?.messages || []);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [greeting, setGreeting] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Random greeting on mount
  useEffect(() => {
    setGreeting(greetingPairs[Math.floor(Math.random() * greetingPairs.length)]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  const setExampleQuery = (query: string) => {
    setInput(query);
    textareaRef.current?.focus();
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: `m${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `m${Date.now() + 1}`,
        role: "assistant",
        content: "I can help you analyze SportPesa jackpot patterns and statistics. Try asking about 'winning patterns' to see detailed analysis with visual components.\n\nThis is a placeholder response — the AI backend will be connected soon with the Vercel AI SDK.",
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // =============================================
  // WELCOME SCREEN (no messages) - nyumbani style
  // =============================================
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center -mt-12 min-h-[calc(100vh-6rem)]">
        <div className="w-full max-w-2xl mx-auto px-4">
          {/* Greeting */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {greeting}
          </h1>

          {/* Input with Sparkles */}
          <div className="relative w-full mb-4">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="How can I help you today?"
              className="w-full pl-12 pr-12 py-4 rounded-lg
                       border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       shadow-sm text-base resize-none leading-5"
              rows={1}
              style={{ minHeight: "56px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2
                       bg-blue-600 hover:bg-blue-700
                       dark:bg-blue-500 dark:hover:bg-blue-600
                       text-white rounded-lg
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {/* Example Queries */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 justify-center flex-wrap">
              {exampleQueries.slice(0, 3).map((query, index) => (
                <button
                  key={index}
                  onClick={() => setExampleQuery(query)}
                  className="bg-white dark:bg-gray-800
                           hover:bg-blue-600 hover:text-white
                           dark:hover:bg-blue-500 dark:hover:text-white
                           text-gray-700 dark:text-gray-200
                           border border-gray-300 dark:border-gray-600
                           px-3 py-1.5 rounded-full text-sm
                           transition-all duration-200 hover:scale-105"
                >
                  {query}
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setExampleQuery(exampleQueries[3])}
                className="bg-white dark:bg-gray-800
                         hover:bg-blue-600 hover:text-white
                         dark:hover:bg-blue-500 dark:hover:text-white
                         text-gray-700 dark:text-gray-200
                         border border-gray-300 dark:border-gray-600
                         px-3 py-1.5 rounded-full text-sm
                         transition-all duration-200 hover:scale-105"
              >
                {exampleQueries[3]}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            Try &quot;Show me the winning patterns&quot; or click an example above
          </p>
        </div>
      </div>
    );
  }

  // =============================================
  // CHAT MODE (has messages) - input pinned bottom
  // =============================================
  return (
    <div className="flex-1 flex flex-col w-full -mt-12 h-[calc(100vh-3rem)]">
      {/* Messages - this is the ONLY scrollable area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 pt-4 pb-40">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="bg-blue-600 dark:bg-blue-500 text-white rounded-2xl px-4 py-3 max-w-[85%]">
                      <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="rounded-2xl px-4 py-3">
                      <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isGenerating && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-500" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Fixed Input - pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 pt-3 pb-4 z-10 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto w-full px-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about jackpot patterns, statistics, or strategies..."
              className="w-full pl-12 pr-12 py-4 rounded-xl
                       border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       shadow-lg text-base resize-none leading-5"
              rows={1}
              style={{ minHeight: "56px", maxHeight: "200px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2
                       bg-blue-600 hover:bg-blue-700
                       dark:bg-blue-500 dark:hover:bg-blue-600
                       text-white rounded-lg
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
