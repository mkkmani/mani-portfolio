'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IPreparation, IMessage, submitFeedback } from '@/services/api/preparation';
import { Send, ThumbsUp, ThumbsDown, Loader, User, Bot, ArrowLeft, BrainCircuit, Calendar, Download, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';
import remarkGfm from 'remark-gfm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AIInteractionProps {
  initialData: IPreparation | null;
  readOnly?: boolean;
}

export default function AIInteraction({ initialData, readOnly = false }: AIInteractionProps) {
  const router = useRouter();
  const [topic, setTopic] = useState(initialData?.topic || '');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    initialData?.difficulty || 'Intermediate'
  );
  const [interviewType, setInterviewType] = useState<'Mock Interview' | 'Study Guide'>('Study Guide');
  const [focusArea, setFocusArea] = useState('General');
  const [messages, setMessages] = useState<IMessage[]>(initialData?.messages || []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const pdfContent = document.createElement('div');
      pdfContent.style.padding = '40px';
      pdfContent.style.backgroundColor = 'white';
      pdfContent.style.width = '800px';
      pdfContent.style.fontFamily = 'Arial, sans-serif';

      const title = initialData?.topic || topic;
      const difficulty = initialData?.difficulty || 'Intermediate';
      const date = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

      pdfContent.innerHTML = `
        <div style="margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px;">
          <h1 style="font-size: 32px; font-weight: bold; color: #000; margin: 0 0 10px 0;">${title}</h1>
          <div style="display: flex; gap: 20px; font-size: 14px; color: #666;">
            <span><strong>From:</strong> <a href="https://manikantaketha.in/interview-prep">manikantaketha.in/interview-prep</a></span>
          </div>
        </div>
      `;

      messages.forEach((msg, idx) => {
        if (msg.role === 'user') {
          // pdfContent.innerHTML += `
          //   <div style="margin: 20px 0;">
          //     <h3 style="font-size: 14px; font-weight: bold; color: #000; margin-bottom: 10px;">Your Question:</h3>
          //     <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; color: #000;">
          //       <p style="margin: 0; white-space: pre-wrap;">${msg.content}</p>
          //     </div>
          //   </div>
          // `;
        } else {
          // Convert markdown to HTML for AI responses
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = msg.content
            .replace(/^markdown\s*/i, '') // Remove "markdown" at the start
            .replace(/^\s*---\s*$/gm, '') // Remove horizontal rules
            .replace(/```([\s\S]*?)```/g, '<pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto;"><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/^# (.+)$/gm, '<h1 style="font-size: 24px; font-weight: bold; margin: 20px 0 10px 0; color: #000;">$1</h1>')
            .replace(/^## (.+)$/gm, '<h2 style="font-size: 20px; font-weight: bold; margin: 18px 0 8px 0; color: #000;">$1</h2>')
            .replace(/^### (.+)$/gm, '<h3 style="font-size: 18px; font-weight: bold; margin: 16px 0 6px 0; color: #000;">$1</h3>')
            .replace(/^- (.+)$/gm, '<li style="margin: 4px 0; color: #000;">$1</li>')
            .replace(/\n\n/g, '</p><p style="margin: 12px 0; color: #000; line-height: 1.6;">');

          pdfContent.innerHTML += `
            <div style="margin: 30px 0;">
              <div style="color: #000; line-height: 1.6;">
                ${tempDiv.innerHTML}
              </div>
            </div>
          `;
        }
      });

      // Append to document temporarily
      document.body.appendChild(pdfContent);

      // Generate PDF
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm

      // Add new pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      // Download PDF
      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_interview_prep.pdf`);

      // Clean up
      document.body.removeChild(pdfContent);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!readOnly) {
      scrollToBottom();
    }
  }, [messages, streamingContent, readOnly]);

  const handleSend = async () => {
    if (!input.trim() && !(!initialData && topic)) return;

    const userMessage: IMessage = {
      role: 'user',
      content: input || `Start preparation for ${topic} (${difficulty})`,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setStreamingContent('');

    try {
      const response = await fetch('/api/interview-prep/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: initialData?.topic || topic,
          difficulty: initialData?.difficulty || difficulty,
          interviewType,
          focusArea,
          messages: [...messages, userMessage],
          existingId: initialData?._id,
        }),
      });

      if (!response.ok) throw new Error('Generation failed');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullContent += chunk;
        setStreamingContent(prev => prev + chunk);
      }

      // Add final assistant message
      const assistantMessage: IMessage = {
        role: 'assistant',
        content: fullContent,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (index: number, type: 'like' | 'dislike') => {
    if (!initialData?._id) return;

    const newMessages = [...messages];
    if (newMessages[index]) {
      newMessages[index].feedback = type;
      setMessages(newMessages);

      await submitFeedback(initialData._id, index, type);
    }
  };

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            fontSize: '0.95rem',
            lineHeight: '1.6',
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-white/10 text-yellow-300 px-2 py-1 rounded text-sm font-mono border border-white/5" {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }: any) => (
      <h1 className="text-3xl md:text-4xl font-bold mt-10 mb-6 text-white border-b border-white/10 pb-3">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-5 text-white/95 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-accent "></span>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl md:text-2xl font-semibold mt-6 mb-4 text-white/90">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg md:text-xl font-semibold mt-5 mb-3 text-white/85">
        {children}
      </h4>
    ),
    p: ({ children }: any) => (
      <p className="mb-5 leading-[1.8] text-[1.05rem] text-gray-200">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="mb-6 space-y-3 text-gray-200">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="mb-6 space-y-3 text-gray-200 list-decimal pl-6">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-[1.7] text-[1.02rem] ml-6 marker:text-accent">
        {children}
      </li>
    ),
    a: ({ children, href }: any) => (
      <a href={href} className="text-accent hover:text-yellow-300 underline decoration-accent/50 hover:decoration-yellow-300 transition-colors font-medium">
        {children}
      </a>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-accent/50 bg-white/[0.03] pl-6 pr-4 py-4 my-6 italic text-gray-300 rounded-r-lg text-[1.02rem] leading-[1.7]">
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse border border-white/10 text-[0.98rem]">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-white/5">
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => (
      <tbody>
        {children}
      </tbody>
    ),
    tr: ({ children }: any) => (
      <tr className="border-b border-white/5">
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-3 text-left font-semibold text-white/90 border border-white/10">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-3 text-gray-200 border border-white/10">
        {children}
      </td>
    ),
    hr: () => (
      <hr className="my-8 border-t-2 border-white/10" />
    ),
    strong: ({ children }: any) => (
      <strong className="font-bold text-white">
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-accent/90">
        {children}
      </em>
    ),
  };

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 py-8 lg:p-0">
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4 print:border-black print:pb-2">
        <div className="flex items-center gap-4">
          <Link href="/interview-prep" className="p-2 hover:bg-white/10  transition-colors print:hidden">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold print:text-black">
              {initialData ? initialData.topic : 'New Session'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-foreground/60 print:text-black/60">
              <span className="px-2 py-0.5  bg-white/5 border border-white/5 text-xs font-bold uppercase print:bg-gray-200 print:border-gray-300 print:text-black">
                {initialData ? initialData.difficulty : difficulty}
              </span>
              {!initialData && (
                <span className="text-xs">Setup your session</span>
              )}
            </div>
          </div>
        </div>
        {(initialData || messages.length > 0) && (
          <div className="w-[100px]"></div>
        )}
      </div>

      {!initialData && messages.length === 0 && (
        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12  bg-accent/20 text-accent mb-4">
              <BrainCircuit size={20} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Start Interview Prep</h1>
            <p className="text-sm text-foreground/60">Choose your topic and difficulty level</p>
          </div>

          <div className="bg-white/5 border border-white/5 p-5  backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold mb-2 uppercase tracking-wider text-foreground/40">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. React Hooks, System Design"
                  className="w-full bg-black/50 border border-white/5 p-3  focus:border-accent outline-none transition-all text-sm placeholder:text-foreground/20"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-2 uppercase tracking-wider text-foreground/40">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setDifficulty(lvl as any)}
                      className={`p-2.5  text-xs font-bold border transition-all ${difficulty === lvl
                        ? 'bg-accent text-black border-accent'
                        : 'bg-black/50 border-white/5 hover:border-white/20 hover:bg-white/5 text-foreground/60'
                        }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-2 uppercase tracking-wider text-foreground/40">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Study Guide', 'Mock Interview'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setInterviewType(type as any)}
                      className={`p-2.5  text-xs font-bold border transition-all ${interviewType === type
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-black/50 border-white/5 hover:border-white/15 text-foreground/60'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-2 uppercase tracking-wider text-foreground/40">Focus</label>
                <div className="grid grid-cols-2 gap-2">
                  {['General', 'Conceptual', 'Coding', 'System Design'].map((area) => (
                    <button
                      key={area}
                      onClick={() => setFocusArea(area)}
                      className={`p-2.5  text-xs font-bold border transition-all ${focusArea === area
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-black/50 border-white/5 hover:border-white/15 text-foreground/60'
                        }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={!topic || loading}
                className="w-full py-3 bg-accent text-black font-bold text-sm  hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader size={16} className="animate-spin" /> : <><Bot size={18} /> Start Session</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {(initialData || messages.length > 0) && (
        <>
          <div className="hidden print:block mb-8 pb-4 border-b-2 border-black">
            <h1 className="text-4xl font-bold text-black mb-2">{initialData?.topic || topic}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-semibold">Difficulty: {initialData?.difficulty || difficulty}</span>
              <span>•</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div ref={chatContainerRef} className={`flex-1 overflow-y-auto mb-6 pr-4 custom-scrollbar max-h-[75vh] ${readOnly ? 'bg-transparent' : 'border border-white/[0.05]  p-6 md:p-8 bg-black/30 space-y-8'}`}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${readOnly ? 'mb-8' : `flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} print:justify-start print:flex-col print:gap-2`}
              >
                {!readOnly && msg.role === 'assistant' && (
                  <div className="w-8 h-8  bg-accent/10 flex items-center justify-center text-accent flex-shrink-0 mt-1 print:hidden">
                    <Bot size={16} />
                  </div>
                )}

                {msg.role === 'assistant' && (
                  <div className="hidden print:block text-sm font-bold text-black mb-1">AI Response:</div>
                )}
                {msg.role === 'user' && (
                  <div className="hidden print:block text-sm font-bold text-black mb-1">Your Question:</div>
                )}

                <div className={`${readOnly
                  ? 'w-full'
                  : `max-w-[90%]  ${msg.role === 'user'
                    ? 'bg-white/10 text-foreground rounded-tr-none p-5 print:bg-gray-100 print:text-black print:max-w-full print:'
                    : 'bg-gradient-to-br from-black/40 to-black/20 border border-white/[0.05] rounded-tl-none p-7 md:p-8 print:bg-white print:border-gray-200 print:text-black print:max-w-full print:'
                  }`
                  }`}>

                  {msg.role === 'user' ? (
                    readOnly ? (
                      null
                      // <div className="mb-6 border-b border-white/10 pb-4">
                      //   {/* <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-2">Topic / Question</h3>
                      //   <p className="text-xl md:text-2xl font-bold text-white">{msg.content}</p> */}
                      // </div>
                    ) : (
                      <p className="whitespace-pre-wrap print:text-black">{msg.content}</p>
                    )
                  ) : (
                    <div className={`prose prose-invert max-w-none ${readOnly ? 'prose-lg' : ''}`}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ...MarkdownComponents,
                          table: ({ children }: any) => (
                            <div className="overflow-x-auto my-6 custom-scrollbar  border border-white/10">
                              <table className="w-full border-collapse text-[0.98rem]">
                                {children}
                              </table>
                            </div>
                          ),
                          code: ({ node, inline, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <div className="overflow-x-auto custom-scrollbar  border border-white/10 my-4">
                                <pre className="p-4 bg-black/20 ">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              </div>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {(() => {
                          let cleanContent = msg.content;
                          if (cleanContent.trim().startsWith('```')) {
                            cleanContent = cleanContent
                              .replace(/^```(?:markdown)?\s*/i, '')
                              .replace(/```\s*$/, '');
                          }

                          cleanContent = cleanContent
                            .replace(/^(#+)\s*\*\*([^*]+)\*\*/gm, '$1 $2')
                            .replace(/^(#+)([^#\s])/gm, '$1 $2')
                            .replace(/\*\*Definition\*\*([^*]+)/g, '**Definition**: $1')
                            .replace(/^(#+)\s+#+\s+/gm, '$1 ');

                          return cleanContent;
                        })()}
                      </ReactMarkdown>

                      {initialData && !readOnly && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.03] print:hidden">
                          <span className="text-xs text-foreground/40 mr-2">Was this helpful?</span>
                          <button
                            onClick={() => handleFeedback(idx, 'like')}
                            className={`p-1.5 rounded hover:bg-white/10 transition-colors ${msg.feedback === 'like' ? 'text-green-400' : 'text-foreground/40'}`}
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button
                            onClick={() => handleFeedback(idx, 'dislike')}
                            className={`p-1.5 rounded hover:bg-white/10 transition-colors ${msg.feedback === 'dislike' ? 'text-red-400' : 'text-foreground/40'}`}
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!readOnly && msg.role === 'user' && (
                  <div className="w-8 h-8  bg-white/10 flex items-center justify-center text-foreground flex-shrink-0 mt-1 print:hidden">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {streamingContent && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8  bg-accent/10 flex items-center justify-center text-accent flex-shrink-0 mt-1">
                  <Bot size={16} />
                </div>
                <div className="max-w-[90%]  p-7 md:p-8 bg-gradient-to-br from-black/40 to-black/20 border border-white/[0.05] rounded-tl-none">
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{streamingContent}</ReactMarkdown>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-accent text-xs animate-pulse">
                    <Loader size={12} className="animate-spin" /> Generating...
                  </div>
                </div>
              </div>
            )}

            {(initialData || messages.length > 0) && (
              <div className="flex justify-center my-8 print:hidden">
                <button
                  onClick={handleDownloadPDF}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30  transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader size={18} className="animate-spin" /> : <Download size={18} />}
                  <span className="font-bold">{loading ? 'Generating PDF...' : 'Download Session PDF'}</span>
                </button>
              </div>
            )}

            {readOnly && (
              <div className="mt-20 p-10  bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16  bg-accent/10 text-accent mb-6 border border-accent/20">
                  <BrainCircuit size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Ready for a new challenge?</h3>
                <p className="text-foreground/60 mb-8 max-w-md mx-auto text-lg">
                  Start a new session to explore different topics or increase the difficulty level.
                </p>
                <Link
                  href="/interview-prep/new"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-black font-bold  hover:bg-white transition-all hover:scale-105"
                >
                  Start New Session
                  <ArrowRight size={18} />
                </Link>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!readOnly && (
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask a follow-up question..."
                className="w-full bg-white/5 border border-white/5 p-4 pr-12  focus:border-accent outline-none transition-colors"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-black  hover:bg-white transition-colors disabled:opacity-50 disabled:bg-transparent disabled:text-foreground/20"
              >
                {loading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
