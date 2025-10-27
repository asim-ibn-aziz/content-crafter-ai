import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { contentType, tone, topic } = await request.json();

    if (!contentType || !tone || !topic) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if we have any API keys
    const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;
    const togetherApiKey = process.env.TOGETHER_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
    // If no API key is set, use mock data
    if (!groqApiKey && !togetherApiKey && !openRouterApiKey && !huggingFaceApiKey) {
      const mockContent = `This is a ${tone.toLowerCase()} ${contentType.toLowerCase()} about ${topic}. 

${topic} is an exciting and important subject that deserves our attention. In this piece, we'll explore what makes ${topic} special and why it matters to you.

Here are the key benefits:
- A deep understanding of ${topic} opens new possibilities
- Practical applications that can change your approach
- Proven strategies that deliver real results

The ${tone.toLowerCase()} nature of this content means we can explore ${topic} in an engaging way that keeps readers interested from start to finish.

Key considerations include understanding the fundamentals, exploring real-world applications, and discovering how to implement best practices in your own context.

In conclusion, ${topic} offers unique opportunities for those willing to dive in and explore. Start your journey today and see where it takes you!`;
      
      return NextResponse.json({ content: mockContent });
    }

    // Now try real AI APIs - Try Groq first (free tier available)
    let response;
    
    // Build the prompt based on content type, tone, and topic
    const prompt = `You are a professional content writer. Create ${contentType.toLowerCase()} content with a ${tone.toLowerCase()} tone about: ${topic}.

Make sure the content is engaging, well-written, and matches the requested tone. Start directly with the content without any preamble or explanation.`;

    // Try Groq first (free tier available)
    if (groqApiKey) {
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });
    } else if (togetherApiKey) {
      // Try Together AI (most generous free tier - $25/month free credits)
      response = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${togetherApiKey}`,
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct-Turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });
    } else if (openRouterApiKey) {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterApiKey}`,
          "HTTP-Referer": "https://your-app-url.vercel.app",
          "X-Title": "Content Crafter AI",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });
    } else {
      return NextResponse.json(
        { error: "API key not configured. Please set either HUGGINGFACE_API_KEY, TOGETHER_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API error:", errorData);
      console.error("Response status:", response.status);
      console.error("Error data:", errorData);
      
      let errorMessage = "Failed to generate content";
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (huggingFaceApiKey && errorData.estimated_time) {
        errorMessage = `Model is loading. Please wait ${Math.ceil(errorData.estimated_time)} seconds and try again.`;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage, 
          details: errorData,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Handle different response formats
    let generatedContent;
    
    if (huggingFaceApiKey) {
      // Hugging Face returns array format
      if (Array.isArray(data) && data[0]?.generated_text) {
        generatedContent = data[0].generated_text.trim();
      } else if (data.generated_text) {
        generatedContent = data.generated_text.trim();
      }
    } else {
      // Standard OpenAI-compatible format
      generatedContent = data.choices?.[0]?.message?.content;
    }

    if (!generatedContent) {
      return NextResponse.json(
        { error: "No content generated", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

