import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Title and content are required",
            details: { title: ["Title is required"], content: ["Content is required"] }
          }
        },
        { status: 400 }
      );
    }

    console.log("Generating AI question with title:", title);

    // Using a simpler AI API that's faster
    const prompt = `Improve this question to be clearer and more specific:

**Original Title:** ${title}

**Original Content:** ${content}

Provide an improved version of the content that:
1. Is clearer and more specific
2. Maintains the user's intent
3. Adds helpful context
4. Follows best practices for technical questions

Return only the improved content in plain text (no markdown).`;

    // Check for API key - use free Hugging Face API as fallback
    const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';
    
    if (!hasOpenAIKey) {
      console.log("Using Hugging Face free API as fallback");
      
      try {
        // Use Hugging Face's free Inference API
        const hfResponse = await fetch(
          "https://api-inference.huggingface.co/models/google/flan-t5-large",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: `Improve this technical question to be clearer and more specific. Title: ${title}. Content: ${content}. Return only the improved content:`,
            }),
            signal: AbortSignal.timeout(30000),
          }
        );

        if (hfResponse.ok) {
          const hfData = await hfResponse.json();
          const improvedContent = hfData[0]?.generated_text?.trim() || content;
          
          return NextResponse.json(
            { success: true, data: improvedContent },
            { status: 200 }
          );
        }
      } catch (hfError) {
        console.error("Hugging Face API error:", hfError);
      }

      // If Hugging Face fails, return original content with improvement suggestion
      return NextResponse.json(
        {
          success: true,
          data: `${content}\n\n💡 Tip: To get AI-powered improvements, add OPENAI_API_KEY to your environment variables.`,
        },
        { status: 200 }
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You improve technical questions. Reply with plain text only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error (masked)", {
        status: response.status,
        message: errorText.slice(0, 200),
      });
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Upstream AI error",
            details: { status: response.status },
          },
        },
        { status: 502 }
      );
    }

    const result = await response.json();

    let text =
      result?.choices?.[0]?.message?.content?.toString()?.trim() ||
      `${content}\n\nNOTE: This question could be improved by adding more specific details, code examples, or error messages.`;

    console.log("AI generation successful");
    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("AI generation error (masked)", { message });
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 502 }
    );
  }
}
