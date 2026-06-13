import { NextRequest, NextResponse } from "next/server";
import { ASSISTANT_SYSTEM_PROMPT } from "@/lib/prompts/assistant";
import { OWNER_PROFILE } from "@/lib/assistant/persona";
import { buildAssistantContext } from "@/lib/assistant/context";
import {
  streamAssistant,
  toTextStream,
  type ChatMessage,
} from "@/lib/assistant/openrouter";
import { rateLimit, tooManyRequests, clientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Input guards - bound abuse and token cost regardless of the rate limiter.
const MAX_MESSAGES = 12; // conversation turns kept
const MAX_CHARS = 1000; // per user message

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);

    // Two-tier per-IP limit: a short burst guard + a generous hourly cap. This
    // keeps the assistant open to all visitors while preventing anyone from
    // draining the owner's API quota or using it as a free general-purpose LLM.
    const burst = await rateLimit("assistant-burst", ip, 6, "1 m");
    if (!burst.success) return tooManyRequests(burst.reset);
    const hourly = await rateLimit("assistant", ip, 40, "1 h");
    if (!hourly.success) return tooManyRequests(hourly.reset);

    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "messages must be a non-empty array" },
        { status: 400 }
      );
    }

    // Sanitize: only user/assistant turns, trimmed and length-capped, recent N.
    const history: ChatMessage[] = body.messages
      .filter(
        (m: unknown): m is ChatMessage =>
          !!m &&
          typeof (m as ChatMessage).content === "string" &&
          ((m as ChatMessage).role === "user" ||
            (m as ChatMessage).role === "assistant")
      )
      .slice(-MAX_MESSAGES)
      .map((m: ChatMessage) => ({
        role: m.role,
        content: m.content.slice(0, MAX_CHARS),
      }));

    if (history.length === 0 || history[history.length - 1].role !== "user") {
      return NextResponse.json(
        { error: "The last message must be from the user." },
        { status: 400 }
      );
    }

    // Assemble the system prompt with the persona + live content catalog.
    const content = await buildAssistantContext();
    const systemPrompt = ASSISTANT_SYSTEM_PROMPT.replace(
      "{{PROFILE}}",
      OWNER_PROFILE
    ).replace("{{CONTENT}}", content);

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...history,
    ];

    const upstream = await streamAssistant(messages);
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: "The assistant is temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    return new NextResponse(toTextStream(upstream.body), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[assistant] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
