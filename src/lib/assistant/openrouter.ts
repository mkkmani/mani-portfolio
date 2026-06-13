import { OPENROUTER_CONFIG } from "@/lib/config";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function streamAssistant(
  messages: ChatMessage[]
): Promise<Response> {
  let lastError: Response | null = null;
  for (const model of OPENROUTER_CONFIG.models) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_CONFIG.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://manikantaketha.in",
        "X-Title": "Manikanta Ketha Site Assistant",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.4,
        max_tokens: 600,
      }),
    });

    if (res.ok && res.body) return res;

    lastError = res;
    const detail = await res
      .clone()
      .text()
      .catch(() => "");
    console.error(
      `[assistant] model ${model} failed (${res.status}): ${detail.slice(0, 300)}`
    );
    if (![429, 500, 502, 503, 504].includes(res.status)) break;
  }
  return lastError ?? new Response("No model available", { status: 502 });
}

export function toTextStream(upstream: ReadableStream<Uint8Array>) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = "";

  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // keep the trailing partial line
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const content = JSON.parse(data).choices?.[0]?.delta?.content || "";
          if (content) controller.enqueue(encoder.encode(content));
        } catch {
          // Partial/non-JSON SSE chunk - skip.
        }
      }
    },
  });

  return upstream.pipeThrough(transform);
}
