import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Preparation from '@/server/models/Preparation';
import { INTERVIEW_PREP_SYSTEM_PROMPT } from '@/lib/prompts/interview-prep';
import { OPENROUTER_CONFIG } from '@/lib/config';
import { auth } from '@/lib/auth';
import { makeSlug } from '@/lib/validation';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  feedback?: 'like' | 'dislike' | null;
}

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

function normalizeDifficulty(value: unknown): Difficulty {
  const v = String(value || '').toLowerCase();
  return (DIFFICULTIES as readonly string[]).includes(v) ? (v as Difficulty) : 'intermediate';
}

function buildExcerpt(text: string, topic: string): string {
  let excerpt = '';
  const tag = text.match(/EXCERPT:\s*(.+?)(?:\n|$)/i);
  if (tag?.[1]) {
    excerpt = tag[1].trim();
  } else {
    const overview = text.match(/#+\s*Overview\s*\n+([\s\S]{0,300}?)(?:\n#+|$)/i);
    if (overview?.[1]) {
      const clean = overview[1].trim().replace(/\*\*/g, '').replace(/\n/g, ' ');
      excerpt = clean.match(/^[^.!?]+[.!?]/)?.[0] ?? clean.substring(0, 150);
    } else {
      excerpt = `Comprehensive interview preparation guide for ${topic}`;
    }
  }
  return excerpt.length > 160 ? excerpt.substring(0, 157) + '...' : excerpt;
}

async function streamWithFallback(apiMessages: ChatMessage[]): Promise<Response> {
  let lastError: Response | null = null;
  for (const model of OPENROUTER_CONFIG.models) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://manikantaketha.in',
        'X-Title': 'Manikanta Ketha',
      },
      body: JSON.stringify({ model, messages: apiMessages, stream: true }),
    });

    if (res.ok && res.body) return res;

    lastError = res;
    const detail = await res.clone().text().catch(() => '');
    console.error(`[generate] model ${model} failed (${res.status}): ${detail.slice(0, 300)}`);
    // Retry the next model on rate-limit / server errors; bail on auth/quota (401/402/403).
    if (![429, 500, 502, 503, 504].includes(res.status)) break;
  }
  return lastError ?? new Response('No model available', { status: 502 });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to continue.' }, { status: 401 });
    }

    const limit = await rateLimit('ai-generate', session.user.id, 30, '1 h');
    if (!limit.success) return tooManyRequests(limit.reset);

    const body = await req.json();
    const { topic, messages, difficulty, existingId, interviewType, focusArea } = body;

    if (typeof topic !== 'string' || !topic.trim()) {
      return NextResponse.json({ error: 'A topic is required' }, { status: 400 });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages must be a non-empty array' }, { status: 400 });
    }

    const normalizedDifficulty = normalizeDifficulty(difficulty);
    const incoming: ChatMessage[] = messages
      .filter((m): m is ChatMessage => m && typeof m.content === 'string' && typeof m.role === 'string')
      .map((m) => ({ role: m.role, content: m.content, feedback: m.feedback ?? null }));

    const systemPrompt = INTERVIEW_PREP_SYSTEM_PROMPT
      .replaceAll('{{TOPIC}}', topic)
      .replaceAll('{{DIFFICULTY}}', difficulty || 'Intermediate')
      .replaceAll('{{INTERVIEW_TYPE}}', interviewType || 'Mock Interview')
      .replaceAll('{{FOCUS_AREA}}', focusArea || 'General');

    const apiMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...incoming.map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await streamWithFallback(apiMessages);
    if (!response.ok || !response.body) {
      const errorText = await response.text().catch(() => '');
      let message = 'AI generation is temporarily unavailable. Please try again shortly.';
      try {
        message = JSON.parse(errorText).error?.message || message;
      } catch {
        /* keep generic message */
      }
      return NextResponse.json({ error: message }, { status: 503 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullResponse = '';

    const stream = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        for (const line of text.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const content = JSON.parse(data).choices?.[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(content));
            }
          } catch {
            // Partial/non-JSON SSE chunk - skip.
          }
        }
      },
      async flush() {
        // Persist the transcript. Errors here are logged, never swallowed silently,
        // and never affect the already-streamed client response.
        try {
          if (!fullResponse.trim()) return;
          await dbConnect();
          const now = new Date();
          const assistantMessage = { role: 'assistant' as const, content: fullResponse, feedback: null, createdAt: now };
          const transcript = [...incoming.map((m) => ({ ...m, createdAt: now })), assistantMessage];

          if (existingId) {
            await Preparation.findOneAndUpdate(
              { _id: existingId, userId: session.user!.id },
              {
                $set: {
                  messages: transcript,
                  'sessionMetadata.lastActivityAt': now,
                  'sessionMetadata.messageCount': transcript.length,
                },
              }
            );
          } else {
            await Preparation.create({
              topic,
              slug: makeSlug(topic),
              excerpt: buildExcerpt(fullResponse, topic),
              difficulty: normalizedDifficulty,
              userId: session.user!.id,
              messages: transcript,
              sessionMetadata: { startedAt: now, lastActivityAt: now, messageCount: transcript.length },
              published: false,
            });
          }
        } catch (err) {
          console.error('[generate] failed to persist preparation:', err);
        }
      },
    });

    return new NextResponse(response.body.pipeThrough(stream), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
