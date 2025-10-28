"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { History, X, RefreshCw, Copy, Calendar } from "lucide-react";

export interface GenerationHistoryItem {
  id: string;
  contentType: string;
  tone: string;
  topic: string;
  content: string;
  timestamp: number;
  wordCount: number;
  characterCount: number;
}

interface GenerationHistoryProps {
  onRegenerate: (item: GenerationHistoryItem) => void;
  onCopy: (content: string) => void;
}

export function GenerationHistory({
  onRegenerate,
  onCopy,
}: GenerationHistoryProps) {
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("content-crafter-history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to parse history from localStorage:", error);
      }
    }
    // Listen for live history updates
    const handleHistoryUpdated = () => {
      try {
        const latest = localStorage.getItem("content-crafter-history");
        if (latest) setHistory(JSON.parse(latest));
      } catch (err) {
        console.error("Failed to update history from event:", err);
      }
    };
    window.addEventListener(
      "content-crafter-history-updated",
      handleHistoryUpdated as EventListener
    );
    return () => {
      window.removeEventListener(
        "content-crafter-history-updated",
        handleHistoryUpdated as EventListener
      );
    };
  }, []);

  const saveToHistory = (
    item: Omit<GenerationHistoryItem, "id" | "timestamp">
  ) => {
    const newItem: GenerationHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    const updatedHistory = [newItem, ...history].slice(0, 50); // Keep only last 50 items
    setHistory(updatedHistory);
    localStorage.setItem(
      "content-crafter-history",
      JSON.stringify(updatedHistory)
    );
    // Emit custom event for live updates
    window.dispatchEvent(new CustomEvent("content-crafter-history-updated"));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("content-crafter-history");
  };

  const deleteItem = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem(
      "content-crafter-history",
      JSON.stringify(updatedHistory)
    );
    window.dispatchEvent(new CustomEvent("content-crafter-history-updated"));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* History Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-9 px-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={history.length === 0}
      >
        <History className="h-4 w-4 mr-2" />
        History ({history.length})
      </Button>

      {/* History Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Generation History
              </h2>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearHistory}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 dark:border-red-700"
                  >
                    Clear All
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[60vh]">
              {history.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No generation history yet</p>
                  <p className="text-sm">
                    Your generated content will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <Card
                      key={item.id}
                      className="transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                {item.contentType}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                •
                              </span>
                              <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                {item.tone}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                •
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(item.timestamp)}
                              </span>
                            </div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              {item.topic}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                              {item.content}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {item.wordCount} words
                              </span>
                              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {item.characterCount} characters
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onCopy(item.content)}
                              className="h-8 w-8 p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                              title="Copy content"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRegenerate(item)}
                              className="h-8 w-8 p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                              title="Regenerate"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteItem(item.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 dark:border-red-700 transition-all duration-200 hover:scale-105"
                              title="Delete"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Hook to use generation history
export function useGenerationHistory() {
  const saveToHistory = (
    item: Omit<GenerationHistoryItem, "id" | "timestamp">
  ) => {
    const savedHistory = localStorage.getItem("content-crafter-history");
    const history: GenerationHistoryItem[] = savedHistory
      ? JSON.parse(savedHistory)
      : [];

    const newItem: GenerationHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    const updatedHistory = [newItem, ...history].slice(0, 50);
    localStorage.setItem(
      "content-crafter-history",
      JSON.stringify(updatedHistory)
    );
    // Emit custom event for live updates
    window.dispatchEvent(new CustomEvent("content-crafter-history-updated"));
  };

  return { saveToHistory };
}
