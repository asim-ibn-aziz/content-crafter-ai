"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Wand2, Copy, RefreshCw, Loader2 } from "lucide-react";

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

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setIsLoading(true);
    setError("");
    setGeneratedContent("");

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleRegenerate = () => {
    setGeneratedContent("");
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Content Crafter AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into engaging content with AI. Generate blogs,
            product descriptions, and social captions in seconds.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Input Form Card */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-gray-900">
                Create Your Content
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <Select
                  value={contentType}
                  onChange={(e) =>
                    setContentType(e.target.value as ContentType)
                  }
                >
                  <option value="Blog Post">Blog Post</option>
                  <option value="Product Description">
                    Product Description
                  </option>
                  <option value="Social Caption">Social Caption</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <Select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as Tone)}
                >
                  <option value="Professional">Professional</option>
                  <option value="Funny">Funny</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Chill">Chill</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic / Keywords
                </label>
                <Input
                  placeholder="e.g., Benefits of morning meditation"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Output Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Generated Content
                </h2>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      disabled={copied}
                    >
                      {copied ? (
                        "Copied!"
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerate}
                      disabled={isLoading}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="bg-gray-50 rounded-md p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {generatedContent}
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                      <p>AI is crafting your content...</p>
                    </div>
                  ) : (
                    <p>Your generated content will appear here</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
