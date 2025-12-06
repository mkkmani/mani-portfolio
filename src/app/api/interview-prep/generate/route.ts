import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Preparation from '@/server/models/Preparation';
import { INTERVIEW_PREP_SYSTEM_PROMPT } from '@/lib/prompts/interview-prep';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { topic, messages, difficulty, existingId, interviewType, focusArea } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
    }

    const systemPrompt = INTERVIEW_PREP_SYSTEM_PROMPT
      .replace('{{TOPIC}}', topic)
      .replace('{{DIFFICULTY}}', difficulty || 'Intermediate')
      .replace('{{INTERVIEW_TYPE}}', interviewType || 'Mock Interview')
      .replace('{{FOCUS_AREA}}', focusArea || 'General');

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mani-portfolio.com',
        'X-Title': 'Mani Portfolio Interview Prep',
      },
      body: JSON.stringify({
        model: 'amazon/nova-2-lite-v1:free',
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json({ error: errorJson.error?.message || 'AI generation failed' }, { status: response.status });
      } catch {
        return NextResponse.json({ error: `AI generation failed: ${response.statusText}` }, { status: response.status });
      }
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullResponse = '';

    const stream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const json = JSON.parse(data);
              const content = json.choices[0]?.delta?.content || '';
              if (content) {
                fullResponse += content;
                controller.enqueue(encoder.encode(content));
              }
            } catch (e) {
              // Ignore parse errors for partial chunks
            }
          }
        }
      },
      async flush() {
        await dbConnect();

        const newMessage = {
          role: 'assistant',
          content: fullResponse,
          createdAt: new Date(),
        };

        if (existingId) {
          await Preparation.findByIdAndUpdate(existingId, {
            $push: { messages: newMessage }
          });
        } else {
          let baseSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          const uniqueId = Math.random().toString(36).substring(2, 8);
          let slug = `${baseSlug}-${uniqueId}`;

          await Preparation.create({
            topic,
            slug,
            title: `${topic} Preparation Guide`,
            excerpt: `AI-generated preparation guide for ${topic} (${difficulty})`,
            difficulty,
            messages: [
              ...messages,
              newMessage
            ],
            published: false,
          });
        }
      }
    });

    return new NextResponse(response.body?.pipeThrough(stream), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
