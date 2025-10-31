import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { question, content, userAnswer } = await req.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({
      question,
      content,
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const prompt = `Question: ${question}

Context: ${content}

User's Answer: ${userAnswer || "None provided"}

Provide a helpful answer in plain text. If the user's answer is correct, confirm it. Otherwise, provide the correct answer.`;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "Missing OPENAI_API_KEY. Add it to .env and restart the dev server."
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
              "You answer programming questions clearly. Reply with plain text only.",
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
      "I'm sorry, I couldn't generate an answer at the moment. Please try again.";

    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("AI answers error (masked)", { message });
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 502 }
    );
  }
}
