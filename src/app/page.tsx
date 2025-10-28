"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Wand2, Copy, RefreshCw, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  GenerationHistory,
  useGenerationHistory,
} from "@/components/generation-history";
import { useToastHelpers } from "@/components/toast";

type ContentType = "Blog Post" | "Product Description" | "Social Caption";
type Tone = "Professional" | "Funny" | "Persuasive" | "Chill";

export default function Home() {
  const [contentType, setContentType] = useState<ContentType>("Blog Post");
  const [tone, setTone] = useState<Tone>("Professional");
  const [topic, setTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { saveToHistory } = useGenerationHistory();
  const { showSuccess, showError, showLoading, hideLoading } =
    useToastHelpers();

  type ChatMessage = { role: "user" | "assistant"; content: string };
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Enter to generate content
      if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        if (!isLoading && topic.trim()) {
          handleGenerate();
        }
      }

      // Ctrl+C to copy content (only when content is generated)
      if (event.ctrlKey && event.key === "c" && generatedContent) {
        // Only trigger if not in an input field
        const target = event.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          event.preventDefault();
          handleCopy();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLoading, topic, generatedContent]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showError("Missing Topic", "Please enter a topic to generate content");
      return;
    }

    setIsLoading(true);
    setError("");
    setGeneratedContent("");

    // Append user message to chat
    setMessages((prev) => [...prev, { role: "user", content: topic }]);

    const loadingToastId = showLoading(
      "Generating Content",
      "AI is crafting your content..."
    );

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType,
          tone,
          topic,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || "Failed to generate content";
        const details = data.details
          ? ` Details: ${JSON.stringify(data.details)}`
          : "";
        throw new Error(errorMsg + details);
      }

      setGeneratedContent(data.content);

      // Append assistant message to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);

      // Save to history
      const wordCount = data.content.split(/\s+/).length;
      const characterCount = data.content.length;
      saveToHistory({
        contentType,
        tone,
        topic,
        content: data.content,
        wordCount,
        characterCount,
      });

      hideLoading(
        loadingToastId,
        "Content Generated!",
        `Successfully created ${wordCount} words`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      showError("Generation Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      showSuccess(
        "Copied to Clipboard",
        "Content has been copied to your clipboard"
      );
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      showError("Copy Failed", "Unable to copy content to clipboard");
    }
  };

  const handleRegenerate = () => {
    setGeneratedContent("");
    handleGenerate();
  };

  const handleHistoryRegenerate = (item: any) => {
    setContentType(item.contentType);
    setTone(item.tone);
    setTopic(item.topic);
    setGeneratedContent("");
    handleGenerate();
  };

  const handleHistoryCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      showSuccess(
        "Copied to Clipboard",
        "Content has been copied to your clipboard"
      );
    } catch (err) {
      console.error("Failed to copy:", err);
      showError("Copy Failed", "Unable to copy content to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Wand2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Content Crafter AI
              </h1>
            </div>
            <div className="flex gap-3">
              <GenerationHistory
                onRegenerate={handleHistoryRegenerate}
                onCopy={handleHistoryCopy}
              />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {messages.length === 0 && !isLoading ? (
          /* Welcome State */
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wand2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
              Welcome to Content Crafter AI
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your ideas into engaging content. Generate blogs,
              product descriptions, and social captions with AI.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Professional tone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Multiple content types</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Lightning fast generation</span>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="space-y-6">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                {m.role === "user" ? (
                  <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                ) : (
                  <div className="max-w-[85%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-4 shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Wand2 className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Assistant
                      </span>
                    </div>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {m.content}
                      </p>
                    </div>
                    {idx === messages.length - 1 && (
                      <div className="flex items-center justify-end gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          disabled={copied}
                          className="h-8 px-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
                          title="Copy content (Ctrl+C)"
                        >
                          {copied ? (
                            "Copied!"
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRegenerate}
                          disabled={isLoading}
                          className="h-8 px-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
                          title="Regenerate content"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Generating Content
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      AI is crafting your {contentType.toLowerCase()}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Describe what you want to create..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleGenerate()
                }
                className="h-12 text-base bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-40 h-12 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                disabled={isLoading}
              >
                <option value="Blog Post">Blog Post</option>
                <option value="Product Description">Product Description</option>
                <option value="Social Caption">Social Caption</option>
              </Select>
              <Select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-32 h-12 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                disabled={isLoading}
              >
                <option value="Professional">Professional</option>
                <option value="Funny">Funny</option>
                <option value="Persuasive">Persuasive</option>
                <option value="Chill">Chill</option>
              </Select>
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !topic.trim()}
                className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Generate content (Ctrl+Enter)"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Press{" "}
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-mono">
                Ctrl+Enter
              </kbd>{" "}
              to generate •{" "}
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-mono">
                Ctrl+C
              </kbd>{" "}
              to copy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
