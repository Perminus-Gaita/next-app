"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Sparkles } from 'lucide-react';

const TabNavigation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [message, setMessage] = useState('');
  const [currentGreeting, setCurrentGreeting] = useState('');
  const textareaRef = useRef(null);

  const greetingPairs = [
    { withName: "Hey, {name}!", withoutName: "Hey there!" },
    { withName: "Hello, {name}!", withoutName: "Hello there!" },
    { withName: "Hi, {name}!", withoutName: "Hi there!" },
    { withName: "Good morning, {name}!", withoutName: "Good morning!" },
    { withName: "Welcome back, {name}!", withoutName: "Welcome back!" },
    { withName: "Good to see you, {name}!", withoutName: "Good to see you!" },
    { withName: "Habari, {name}!", withoutName: "Habari!" },
    { withName: "Habari yako, {name}!", withoutName: "Habari yako!" },
    { withName: "Unasema aje leo, {name}!", withoutName: "Unasema aje leo!" },
  ];

  const exampleQueries = [
    "Create a market for UFC 310",
    "Show me trending pools",
    "Explain how betting pools work",
    "What are the leaderboard rankings?",
  ];

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const randomPair = greetingPairs[Math.floor(Math.random() * greetingPairs.length)];
    setCurrentGreeting(randomPair.withoutName);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    console.log("Sending message:", message);
    setMessage('');
  };

  const setExampleQuery = (query) => {
    setMessage(query);
  };

  return (
    <div className="relative w-full">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{currentGreeting}</h1>
          
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-4xl">
              <div className="flex flex-col items-center mb-6 max-w-2xl mx-auto">
                <div className="relative flex-1 w-full mb-4">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="How can I help you today?"
                    className="w-full pl-12 pr-12 py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-base resize-none leading-5"
                    rows={1}
                    style={{ minHeight: '56px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent' }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {exampleQueries.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => setExampleQuery(query)}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-sm transition-all duration-200 hover:scale-105"
                    >
                      {query}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  💡 Try: Create a market for [event] or describe any future event you want to bet on
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;