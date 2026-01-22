"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IPreparation,
  IMessage,
  submitFeedback,
} from "@/services/api/preparation";
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  Loader,
  User,
  Bot,
  ArrowLeft,
  BrainCircuit,
  Calendar,
  Download,
  ArrowRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";

SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("json", json);
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";
import { useSession } from "next-auth/react";

interface AIInteractionProps {
  initialData: IPreparation | null;
  readOnly?: boolean;
}

export default function AIInteraction({
  initialData,
  readOnly = false,
}: AIInteractionProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [topic, setTopic] = useState(initialData?.topic || "");
  const [difficulty, setDifficulty] = useState<
    "Beginner" | "Intermediate" | "Advanced"
  >(initialData?.difficulty || "Intermediate");
  const [interviewType, setInterviewType] = useState<
    "Mock Interview" | "Study Guide"
  >("Study Guide");
  const [focusArea, setFocusArea] = useState("General");
  const [messages, setMessages] = useState<IMessage[]>(
    initialData?.messages || []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const title = initialData?.topic || topic;
      const difficulty = initialData?.difficulty || "Intermediate";
      const date = new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });

      // Create PDF using jsPDF text methods for much smaller file size
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Helper function to add new page if needed
      const checkPageBreak = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
      };

      // Add title
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      checkPageBreak(15);
      pdf.text(title, margin, yPosition);
      yPosition += 15;

      // Add metadata
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      checkPageBreak(8);
      pdf.text(`Difficulty: ${difficulty}`, margin, yPosition);
      yPosition += 6;
      checkPageBreak(8);
      pdf.text(`Date: ${date}`, margin, yPosition);
      yPosition += 6;
      checkPageBreak(8);
      pdf.text("From: manikantaketha.in/interview-prep", margin, yPosition);
      yPosition += 15;

      // Add separator line
      checkPageBreak(2);
      pdf.setDrawColor(0);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      // Process messages
      messages.forEach((msg, idx) => {
        if (msg.role === "assistant") {
          // Process markdown content
          let content = msg.content
            .replace(/^markdown\s*/i, "") // Remove "markdown" prefix
            .replace(/^\s*---\s*$/gm, "") // Remove horizontal rules
            .replace(/^\s*\*\s+/gm, "- ") // Convert * bullets to - bullets
            .replace(/^\s*\d+\)\s+/gm, (match: string) => {
              // Convert "1)" to "1." format
              return match.replace(")", ".");
            });

          // Split content into lines and process
          const lines = content.split("\n");
          let inCodeBlock = false;
          let codeBlockContent: string[] = [];

          lines.forEach((line: string) => {
            line = line.trim();

            // Handle code blocks
            if (line.startsWith("```")) {
              if (!inCodeBlock) {
                inCodeBlock = true;
                codeBlockContent = [];
              } else {
                inCodeBlock = false;
                // Output the code block
                checkPageBreak(8);
                pdf.setFontSize(10);
                pdf.setFont("courier", "normal");
                pdf.setFillColor(245, 245, 245);
                pdf.rect(
                  margin - 2,
                  yPosition - 5,
                  contentWidth + 4,
                  codeBlockContent.length * 4 + 6,
                  "F"
                );

                codeBlockContent.forEach((codeLine: string) => {
                  checkPageBreak(4);
                  pdf.text(codeLine, margin, yPosition);
                  yPosition += 4;
                });
                yPosition += 8;
              }
              return;
            }

            if (inCodeBlock) {
              codeBlockContent.push(line);
              return;
            }

            if (!line) {
              yPosition += 3; // Empty line spacing
              return;
            }

            // Handle blockquotes
            if (line.startsWith(">")) {
              const blockquoteText = line.substring(1).trim();
              checkPageBreak(5);
              pdf.setFontSize(11);
              pdf.setFont("helvetica", "italic");
              pdf.text(blockquoteText, margin + 5, yPosition); // Indent blockquote
              yPosition += 5;
            }
            // Handle headers
            else if (line.startsWith("# ")) {
              const headerText = line
                .substring(2)
                .replace(/\*\*/g, "")
                .replace(/\*/g, "");
              checkPageBreak(10);
              pdf.setFontSize(16);
              pdf.setFont("helvetica", "bold");
              pdf.text(headerText, margin, yPosition);
              yPosition += 10;
            } else if (line.startsWith("## ")) {
              const headerText = line
                .substring(3)
                .replace(/\*\*/g, "")
                .replace(/\*/g, "");
              checkPageBreak(8);
              pdf.setFontSize(14);
              pdf.setFont("helvetica", "bold");
              pdf.text(headerText, margin, yPosition);
              yPosition += 8;
            } else if (line.startsWith("### ")) {
              const headerText = line
                .substring(4)
                .replace(/\*\*/g, "")
                .replace(/\*/g, "");
              checkPageBreak(7);
              pdf.setFontSize(12);
              pdf.setFont("helvetica", "bold");
              pdf.text(headerText, margin, yPosition);
              yPosition += 7;
            }
            // Handle list items
            else if (line.startsWith("- ")) {
              const listText = line
                .substring(2)
                .replace(/\*\*([^*]+)\*\*/g, "$1")
                .replace(/\*/g, "");
              checkPageBreak(5);
              pdf.setFontSize(11);
              pdf.setFont("helvetica", "normal");
              pdf.text("• " + listText, margin, yPosition);
              yPosition += 5;
            }
            // Handle numbered lists
            else if (/^\d+\.\s/.test(line)) {
              const listText = line
                .replace(/^\d+\.\s/, "")
                .replace(/\*\*([^*]+)\*\*/g, "$1")
                .replace(/\*/g, "");
              checkPageBreak(5);
              pdf.setFontSize(11);
              pdf.setFont("helvetica", "normal");
              pdf.text(
                line.replace(/^\d+\.\s/, (match: string) => match),
                margin,
                yPosition
              );
              yPosition += 5;
            }
            // Handle regular text with inline formatting
            else {
              // Process the text for inline formatting
              let processedText = line;

              // Handle special cases like "** (Intermediate)**"
              processedText = processedText.replace(
                /\*\*\s*\([^)]+\)\s*\*\*/g,
                (match: string) => {
                  return match.replace(/\*\*/g, "").trim();
                }
              );

              // Remove all markdown formatting for clean text
              processedText = processedText
                .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold text
                .replace(/\*([^*]+)\*/g, "$1") // Italic text
                .replace(/`([^`]+)`/g, "$1") // Inline code
                .replace(/^\*\s+/, "") // Remove bullet points if any
                .replace(/^\d+\)\s+/, "") // Remove numbered list if any
                .replace(/^\d+\.\s+/, "") // Remove numbered list with dot if any
                .replace(/^>\s+/, ""); // Remove blockquote marker if any

              if (processedText.trim()) {
                checkPageBreak(5);
                pdf.setFontSize(11);
                pdf.setFont("helvetica", "normal");

                // Split long lines
                const splitText = pdf.splitTextToSize(
                  processedText,
                  contentWidth
                );
                splitText.forEach((textLine: string) => {
                  checkPageBreak(5);
                  pdf.text(textLine, margin, yPosition);
                  yPosition += 5;
                });
              }
            }
          });

          yPosition += 10; // Space between messages
        }
      });

      // Download PDF
      pdf.save(
        `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_interview_prep.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!readOnly) {
      scrollToBottom();
    }
  }, [messages, streamingContent, readOnly]);

  useEffect(() => {
    if (!initialData && !readOnly) {
      const pendingSession = sessionStorage.getItem("pendingInterviewSession");
      if (pendingSession) {
        try {
          const sessionData = JSON.parse(pendingSession);
          setTopic(sessionData.topic);
          setDifficulty(sessionData.difficulty);
          setInterviewType(sessionData.interviewType);
          setFocusArea(sessionData.focusArea);

          // Clear the stored data
          sessionStorage.removeItem("pendingInterviewSession");

          // Auto-start the session
          setTimeout(() => {
            handleSend();
          }, 500);
        } catch (error) {
          console.error("Error restoring session:", error);
          sessionStorage.removeItem("pendingInterviewSession");
        }
      }
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() && !(!initialData && topic)) return;

    // Check authentication before starting new session
    if (!initialData && messages.length === 0) {
      if (!session || !session.user) {
        // Store session data for auto-start after login
        sessionStorage.setItem(
          "pendingInterviewSession",
          JSON.stringify({
            topic,
            difficulty,
            interviewType,
            focusArea,
          })
        );

        // Redirect to sign-in
        const currentPath = window.location.pathname;
        const signInUrl = `/sign-in?callbackUrl=${encodeURIComponent(
          currentPath
        )}`;
        router.push(signInUrl);
        return;
      }
    }

    const userMessage: IMessage = {
      role: "user",
      content: input || `Start preparation for ${topic} (${difficulty})`,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setStreamingContent("");

    try {
      const response = await fetch("/api/interview-prep/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: initialData?.topic || topic,
          difficulty: initialData?.difficulty || difficulty,
          interviewType,
          focusArea,
          messages: [...messages, userMessage],
          existingId: initialData?._id,
        }),
      });

      // Handle authentication error (backup check)
      if (response.status === 401) {
        // Redirect to sign-in with callback URL to auto-start session after login
        const currentPath = window.location.pathname;
        const signInUrl = `/sign-in?callbackUrl=${encodeURIComponent(
          currentPath
        )}`;
        router.push(signInUrl);
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Generation failed");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullContent += chunk;
        setStreamingContent((prev) => prev + chunk);
      }

      // Add final assistant message
      const assistantMessage: IMessage = {
        role: "assistant",
        content: fullContent,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingContent("");
    } catch (error) {
      console.error("Error:", error);

      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));

      // Show user-friendly error
      alert(
        error instanceof Error
          ? error.message
          : "Failed to generate response. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (index: number, type: "like" | "dislike") => {
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
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{
            background: "#050505",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "0px",
            padding: "1.5rem",
            fontSize: "0.9rem",
            lineHeight: "1.6",
          }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          className="bg-white/5 text-accent px-2 py-0.5 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }: any) => (
      <h1 className="text-3xl md:text-5xl font-serif uppercase tracking-tighter mt-12 mb-6 text-white">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl md:text-4xl font-serif uppercase tracking-tighter mt-10 mb-5 text-white underline decoration-accent/20 underline-offset-8">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-8 mb-4 text-white">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mt-6 mb-3 text-accent">
        [ {children} ]
      </h4>
    ),
    p: ({ children }: any) => (
      <p className="mb-6 leading-relaxed text-foreground/60 font-light lowercase italic">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="mb-6 space-y-3 text-white">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="mb-6 space-y-3 text-white list-decimal pl-6">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-[1.7] text-[1.02rem] ml-6 marker:text-accent">
        {children}
      </li>
    ),
    a: ({ children, href }: any) => (
      <a
        href={href}
        className="text-accent hover:text-yellow-300 underline decoration-accent/50 hover:decoration-yellow-300 transition-colors font-medium"
      >
        {children}
      </a>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-accent bg-white/[0.05] pl-6 pr-4 py-4 my-6 italic text-white rounded-r-lg text-[1.02rem] leading-[1.7]">
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
      <thead className="bg-white/5">{children}</thead>
    ),
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => (
      <tr className="border-b border-white/5">{children}</tr>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-3 text-left font-semibold text-white border border-white/20">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-3 text-white border border-white/20">
        {children}
      </td>
    ),
    hr: () => <hr className="my-8 border-t-2 border-white/10" />,
    strong: ({ children }: any) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-accent/90">{children}</em>
    ),
  };

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 py-4 lg:p-0">
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4 print:border-black print:pb-2">
        <div className="flex items-center gap-4">
          <Link
            href="/interview-prep"
            className="p-2 hover:bg-white/10  transition-colors print:hidden"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold print:text-black capitalize">
              {initialData ? initialData.topic : "New Session"}
            </h1>
            <div className="flex items-center gap-2 text-sm text-foreground/60 print:text-black/60">
              <span className="px-2 py-0.5  bg-white/5 border border-white/5 text-xs font-bold uppercase print:bg-gray-200 print:border-gray-300 print:text-black">
                {initialData ? initialData.difficulty : difficulty}
              </span>
              {!initialData && (
                <span className="text-xs">Start your session</span>
              )}
            </div>
          </div>
        </div>
        {(initialData || messages.length > 0) && (
          <div className="w-[100px]"></div>
        )}
      </div>

      {!initialData && messages.length === 0 && (
        <div className="max-w-xl mx-auto w-full flex flex-col">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12  bg-accent/20 text-accent mb-4">
              <BrainCircuit size={20} className="rotate-90" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Start Interview Prep
            </h1>
            <p className="text-sm text-foreground/60">
              Choose your topic and difficulty level
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 p-5  backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold mb-2 uppercase tracking-wider text-foreground/40">
                  Topic
                </label>
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
                <label className="block text-[10px] font-bold mb-2 uppercase tracking-wider text-foreground/40">
                  Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setDifficulty(lvl as any)}
                      className={`p-2.5  text-xs font-bold border transition-all ${
                        difficulty === lvl
                          ? "bg-accent text-black border-accent"
                          : "bg-black/50 border-white/5 hover:border-white/20 hover:bg-white/5 text-foreground/60"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-2 uppercase tracking-wider text-foreground/40">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Study Guide", "Mock Interview"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setInterviewType(type as any)}
                      className={`p-2.5  text-xs font-bold border transition-all ${
                        interviewType === type
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-black/50 border-white/5 hover:border-white/15 text-foreground/60"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-2 uppercase tracking-wider text-foreground/40">
                  Focus
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["General", "Conceptual", "Coding", "System Design"].map(
                    (area) => (
                      <button
                        key={area}
                        onClick={() => setFocusArea(area)}
                        className={`p-2.5  text-xs font-bold border transition-all ${
                          focusArea === area
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-black/50 border-white/5 hover:border-white/15 text-foreground/60"
                        }`}
                      >
                        {area}
                      </button>
                    )
                  )}
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={!topic || loading}
                className="w-full py-3 bg-accent text-black font-bold text-sm  hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <>
                    <Bot size={18} /> Start Session
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {(initialData || messages.length > 0) && (
        <>
          <div className="hidden print:block mb-8 pb-4 border-b-2 border-black">
            <h1 className="text-4xl font-bold text-black mb-2">
              {initialData?.topic || topic}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-semibold">
                Difficulty: {initialData?.difficulty || difficulty}
              </span>
              <span>•</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div
            ref={chatContainerRef}
            className={`flex-1 overflow-y-auto mb-6 pr-4 custom-scrollbar max-h-[75vh] ${
              readOnly
                ? "bg-transparent"
                : "border border-white/[0.05]  p-6 md:p-8 bg-black/30 space-y-8"
            }`}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${
                  readOnly
                    ? "mb-8"
                    : `flex gap-4 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`
                } print:justify-start print:flex-col print:gap-2`}
              >
                {!readOnly && msg.role === "assistant" && (
                  <div className="w-8 h-8  bg-accent/10 flex items-center justify-center text-accent flex-shrink-0 mt-1 print:hidden">
                    <Bot size={16} />
                  </div>
                )}

                {msg.role === "assistant" && (
                  <div className="hidden print:block text-sm font-bold text-black mb-1">
                    AI Response:
                  </div>
                )}
                {msg.role === "user" && (
                  <div className="hidden print:block text-sm font-bold text-black mb-1">
                    Your Question:
                  </div>
                )}

                <div
                  className={`${
                    readOnly
                      ? "w-full"
                      : `max-w-[85%] ${
                          msg.role === "user"
                            ? "bg-white/5 border-l-2 border-accent p-6 text-white"
                            : "bg-black border border-white/5 p-8 md:p-12 text-foreground/80"
                        }`
                  }`}
                >
                  {msg.role === "user" ? (
                    readOnly ? null : (
                      // <div className="mb-6 border-b border-white/10 pb-4">
                      //   {/* <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-2">Topic / Question</h3>
                      //   <p className="text-xl md:text-2xl font-bold text-white">{msg.content}</p> */}
                      // </div>
                      <p className="whitespace-pre-wrap print:text-black">
                        {msg.content}
                      </p>
                    )
                  ) : (
                    <div
                      className={`prose prose-invert max-w-none ${
                        readOnly ? "prose-lg" : ""
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ...MarkdownComponents,
                          table: ({ children }: any) => (
                            <div className="overflow-x-auto my-8 border border-white/5 bg-black">
                              <table className="w-full border-collapse">
                                {children}
                              </table>
                            </div>
                          ),
                          code: ({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }: any) => {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
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
                          if (cleanContent.trim().startsWith("```")) {
                            cleanContent = cleanContent
                              .replace(/^```(?:markdown)?\s*/i, "")
                              .replace(/```\s*$/, "");
                          }

                          cleanContent = cleanContent
                            .replace(/^(#+)\s*\*\*([^*]+)\*\*/gm, "$1 $2")
                            .replace(/^(#+)([^#\s])/gm, "$1 $2")
                            .replace(
                              /\*\*Definition\*\*([^*]+)/g,
                              "**Definition**: $1"
                            )
                            .replace(/^(#+)\s+#+\s+/gm, "$1 ");

                          return cleanContent;
                        })()}
                      </ReactMarkdown>

                      {initialData && !readOnly && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.03] print:hidden">
                          <span className="text-xs text-foreground/40 mr-2">
                            Was this helpful?
                          </span>
                          <button
                            onClick={() => handleFeedback(idx, "like")}
                            className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                              msg.feedback === "like"
                                ? "text-green-400"
                                : "text-foreground/40"
                            }`}
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button
                            onClick={() => handleFeedback(idx, "dislike")}
                            className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                              msg.feedback === "dislike"
                                ? "text-red-400"
                                : "text-foreground/40"
                            }`}
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!readOnly && msg.role === "user" && (
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
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={MarkdownComponents}
                    >
                      {streamingContent}
                    </ReactMarkdown>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-accent text-xs animate-pulse">
                    <Loader size={12} className="animate-spin" /> Generating...
                  </div>
                </div>
              </div>
            )}

            {(initialData || messages.length > 0) &&
              !loading &&
              !streamingContent && (
                <div className="flex justify-center my-8 print:hidden">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-6 py-3 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30  transition-all hover:scale-105"
                  >
                    <Download size={18} />
                    <span className="font-bold">Download Session PDF</span>
                  </button>
                </div>
              )}

            {readOnly && (
              <div className="mt-20 p-10  bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16  bg-accent/10 text-accent mb-6 border border-accent/20">
                  <BrainCircuit size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Ready for a new challenge?
                </h3>
                <p className="text-foreground/60 mb-8 max-w-md mx-auto text-lg">
                  Start a new session to explore different topics or increase
                  the difficulty level.
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
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                placeholder="Ask a follow-up question..."
                className="w-full bg-white/5 border border-white/5 p-4 pr-12  focus:border-accent outline-none transition-colors"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-black  hover:bg-white transition-colors disabled:opacity-50 disabled:bg-transparent disabled:text-foreground/20"
              >
                {loading ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
