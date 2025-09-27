"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useRef, useEffect } from "react";
import BeginChat from "./BeginChat";
import {
  MessageCircle,
  RotateCcw,
  SendHorizontal,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  getRandomEmailMessage,
  getRandomGoodbyeMessage,
  getRandomInvalidEmailMessage,
  getRandomMessageMessage,
  getRandomNameMessage,
  getRandomVerificationFailMessage,
  getRandomVerificationMessage,
  getRandomVerificationSuccessMessage,
  getRandomWelcomeMessage,
} from "./utils";
import { InputStep } from "./types";
import { toast } from "sonner";

type Message = {
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
  complete: boolean;
  id: string;
  step: InputStep;
};

type BotMessageProps = {
  message: string;
  currentStep: InputStep;
  name?: string;
  email?: string;
  messageContent?: string;
};

const BotMessage = ({
  message,
  currentStep,
  name,
  email,
  messageContent,
}: BotMessageProps) => {
  const paragraphs = message.split("\n\n");

  return (
    <div
      className={`p-4 rounded-2xl rounded-tl-none ${
        currentStep === "confirmation"
          ? "bg-primary/5 border border-primary/20"
          : "bg-muted/50 dark:bg-muted/30"
      } max-w-[85%] self-start text-sm space-y-2`}
    >
      {currentStep === "confirmation" ? (
        <div className="space-y-6 bg-card rounded-xl p-6 shadow-md border">
          <div className="flex items-center gap-3 text-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Confirm your details</h3>
              <p className="text-sm text-muted-foreground">
                Please review before sending
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Name
              </p>
              <p className="font-medium text-foreground">{name}</p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Email
              </p>
              <p className="font-medium text-foreground">{email}</p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Your Message
              </p>
              <p className="whitespace-pre-line text-foreground/90">
                {messageContent}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Does everything look good?
            </p>
            <p className="mt-1 font-medium text-foreground">
              Type <span className="text-primary">&apos;yes&apos;</span> to send
              or <span className="text-primary">&apos;no&apos;</span> to start
              over
            </p>
          </div>
        </div>
      ) : (
        paragraphs.map((paragraph, i) => (
          <p key={i} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))
      )}
    </div>
  );
};

const TypingIndicator = () => {
  return (
    <div className="p-4 rounded-3xl rounded-bl-none bg-primary/25 max-w-[85%] self-start flex items-center space-x-1">
      <div className="dot rounded-full size-2 bg-primary-foreground animate-bounce [animation-delay:-0.3s]"></div>
      <div className="dot rounded-full size-2 bg-primary-foreground animate-bounce [animation-delay:-0.15s]"></div>
      <div className="dot rounded-full size-2 bg-primary-foreground animate-bounce"></div>
    </div>
  );
};

const UserMessage = ({ message }: { message: string }) => {
  return (
    <div className="p-4 rounded-2xl rounded-tr-none bg-primary/90 text-primary-foreground max-w-[85%] self-end text-sm">
      {message}
    </div>
  );
};

const botWelcomeMessage: Message = {
  text: getRandomWelcomeMessage(),
  sender: "bot",
  timestamp: new Date(),
  complete: true,
  id: Date.now().toString(),
  step: "welcome",
};

const ContactMe = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [currentStep, setCurrentStep] = useState<InputStep | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [verificationAnswer, setVerificationAnswer] = useState<number | null>(
    null
  );
  const [verificationCount, setVerificationCount] = useState<number>(0);

  const [userResponse, setUserResponse] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isChatOpen) {
      beginChat();
    }
  }, []);

  const beginChat = () => {
    setUserResponse("");
    setIsChatOpen(true);
    setIsTyping(true);

    setMessages([botWelcomeMessage]);

    setTimeout(() => {
      const { problem, answer } = getRandomVerificationMessage();
      setVerificationAnswer(answer);

      setMessages((prevMessages) => [
        ...(prevMessages || []).filter((m) => m.id !== botWelcomeMessage.id),
        {
          ...botWelcomeMessage,
          complete: true,
        },
        {
          text: problem,
          sender: "bot" as const,
          timestamp: new Date(),
          complete: true,
          id: `verify-${Date.now()}`,
          step: "verification",
        },
      ]);
      setIsTyping(false);
      setCurrentStep("verification");
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!userResponse) return;

    setIsTyping(true);
    const newUserMessage: Message = {
      text: userResponse,
      sender: "user",
      timestamp: new Date(),
      complete: true,
      id: Date.now().toString(),
      step: "verification",
    };

    setMessages((prevMessages) => [...(prevMessages || []), newUserMessage]);
    setUserResponse("");

    setTimeout(() => {
      setIsTyping(false);

      switch (currentStep) {
        case "verification": {
          const userNumber = Number(userResponse);
          if (userNumber === verificationAnswer) {
            // Correct answer
            const newSuccessMessage: Message = {
              text: getRandomVerificationSuccessMessage(),
              sender: "bot",
              timestamp: new Date(),
              complete: true,
              id: `success-${Date.now()}`,
              step: "verification",
            };
            const newNameMessage: Message = {
              text: userDetails.name
                ? `I see you've previously entered your name as "${userDetails.name}". Is that correct? (yes/no)`
                : getRandomNameMessage(),
              sender: "bot",
              timestamp: new Date(),
              complete: true,
              id: `name-prompt-${Date.now()}`,
              step: "name",
            };
            setMessages((prevMessages) => [
              ...(prevMessages || []),
              newSuccessMessage,
              newNameMessage,
            ]);
            setCurrentStep("name");
            if (userDetails.name) {
              setUserResponse("");
            }
          } else {
            // Incorrect answer
            setVerificationCount((prev) => prev + 1);
            const newFailMessage: Message = {
              text: getRandomVerificationFailMessage(),
              sender: "bot",
              timestamp: new Date(),
              complete: true,
              id: Date.now().toString(),
              step: "verification",
            };
            setMessages((prevMessages) => [
              ...(prevMessages || []),
              newFailMessage,
            ]);

            // Handle too many failed attempts
            if (verificationCount >= 2) {
              const { problem, answer } = getRandomVerificationMessage();
              setVerificationAnswer(answer);
              const newProblemMessage: Message = {
                text:
                  "You've had a few attempts. Let's try a new problem.\n\n" +
                  problem,
                sender: "bot",
                timestamp: new Date(),
                complete: true,
                id: Date.now().toString(),
                step: "verification",
              };
              setMessages((prevMessages) => [
                ...(prevMessages || []),
                newProblemMessage,
              ]);
              setVerificationCount(0); // Reset count for the new problem
            }
          }
          break;
        }

        case "name": {
          let nextStep = true;

          if (userDetails.name) {
            // If we already had a name and user confirmed it's correct
            if (userResponse.toLowerCase() === "yes") {
              nextStep = true;
            } else if (userResponse.toLowerCase() === "no") {
              // If user says the name is not correct, ask for it again
              const newNamePrompt: Message = {
                text: "I see, what's your name then?",
                sender: "bot",
                timestamp: new Date(),
                complete: true,
                id: `new-name-prompt-${Date.now()}`,
                step: "name",
              };
              setMessages((prev) => [...(prev || []), newNamePrompt]);
              nextStep = false;
              setCurrentStep("name");
            }
          } else {
            // This is the first time entering name
            const userName = {
              name: userResponse,
              step: "name",
              sender: "user",
              timestamp: new Date(),
              complete: true,
              id: Date.now().toString(),
            };
            setUserDetails((prev) => ({ ...prev, name: userResponse }));
          }

          if (nextStep) {
            const emailPrompt = userDetails.email
              ? `I see you've previously used ${userDetails.email}. Is this still your email? (yes/no)`
              : getRandomEmailMessage();

            const newEmailMessage: Message = {
              text: emailPrompt,
              sender: "bot",
              timestamp: new Date(),
              complete: true,
              id: `email-prompt-${Date.now()}`,
              step: "email",
            };
            setMessages((prev) => [...(prev || []), newEmailMessage]);
            setCurrentStep("email");

            if (userDetails.email) {
              setUserResponse("");
            }
          }
          break;
        }

        case "email": {
          let emailToUse = userResponse;

          // Handle if we're confirming an existing email
          if (userDetails.email) {
            if (userResponse.toLowerCase() === "yes") {
              emailToUse = userDetails.email;
            } else if (userResponse.toLowerCase() === "no") {
              const newEmailPrompt: Message = {
                text: "I see, what's your email then?",
                sender: "bot",
                timestamp: new Date(),
                complete: true,
                id: `new-email-prompt-${Date.now()}`,
                step: "email",
              };
              setMessages((prev) => [...(prev || []), newEmailPrompt]);
              setCurrentStep("email");
              setUserResponse("");
              setUserDetails((prev) => ({ ...prev, email: "" }));
              break;
            }
          }

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToUse)) {
            // Invalid email format
            const newInvalidEmailMessage: Message = {
              text: getRandomInvalidEmailMessage(),
              sender: "bot",
              timestamp: new Date(),
              complete: true,
              id: `invalid-email-${Date.now()}`,
              step: "email",
            };
            setMessages((prev) => [...(prev || []), newInvalidEmailMessage]);
            // Stay on the same step to prompt again
          } else {
            // Valid email - update the email in state
            if (emailToUse !== userDetails.email) {
              setUserDetails((prev) => ({ ...prev, email: emailToUse }));
            }

            const messagePrompt = userDetails.message
              ? `I see you previously wrote: "${userDetails.message}"\n\nWould you like to edit it or send it as is? (edit/send)`
              : getRandomMessageMessage();

            const newMessageMessage: Message = {
              text: messagePrompt,
              sender: "bot",
              timestamp: new Date(),
              complete: true,
              id: `message-prompt-${Date.now()}`,
              step: "message",
            };

            setMessages((prev) => [...(prev || []), newMessageMessage]);
            setCurrentStep("message");

            if (userDetails.message) {
              setUserResponse("");
            }
          }
          break;
        }

        case "message": {
          const confirmationMessage = "confirmationMessage";

          const newMessageMessage: Message = {
            text: confirmationMessage,
            sender: "bot",
            timestamp: new Date(),
            complete: true,
            id: `confirm-${Date.now()}`,
            step: "confirmation",
          };

          // Update user details with the message
          setUserDetails((prev) => ({
            ...prev,
            message: userResponse,
          }));

          setMessages((prevMessages) => [
            ...(prevMessages || []),
            newMessageMessage,
          ]);
          setCurrentStep("confirmation");
          break;
        }

        case "confirmation": {
          if (userResponse.toLowerCase() === "yes") {
            const newConfirmationMessage: Message = {
              text: getRandomGoodbyeMessage(),
              sender: "bot",
              timestamp: new Date(),
              complete: true,
              id: Date.now().toString(),
              step: "goodbye",
            };
            setMessages((prevMessages) => [
              ...(prevMessages || []),
              newConfirmationMessage,
            ]);
            setCurrentStep("goodbye");
            handleSubmitMessage();
          } else {
            setUserResponse("");
            setMessages([]);
            beginChat();
          }
          break;
        }
      }
    }, 500);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmitMessage = async () => {
    if (!userResponse) return;
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });
    if (!res.ok) {
      toast.error("Failed to send message Please try again");
    }
    if (res.ok) {
      toast.success("Message sent successfully");
    }
    setUserResponse("");
    setMessages([]);
    beginChat();
  };

  if (!isChatOpen) {
    return <BeginChat onClick={beginChat} />;
  }

  return (
    <div className="w-full h-full min-h-screen flex-col max-w-xl mx-auto max-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col gap-4 border border-primary/45 bg-card/40 rounded-lg w-full h-[600px]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-primary/5"></div>
          <div className="relative flex items-center justify-between p-4 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/10 shadow-sm group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <MessageCircle className="text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Hey there! 👋
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="animate-pulse">•</span>
                    <span>Let&apos;s build something amazing together!</span>
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-medium px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 text-foreground/80 hover:text-foreground transition-all flex items-center gap-1.5 group"
            >
              <RotateCcw className="text-primary" />
              Restart
            </button>
          </div>
        </div>

        <div
          ref={messagesEndRef}
          className="flex flex-col gap-6 overflow-y-auto flex-1 pb-36 p-4"
        >
          {messages?.map((message, index) => {
            if (message.sender === "bot") {
              return (
                <BotMessage
                  key={index}
                  message={message.text}
                  currentStep={message.step}
                  name={userDetails.name}
                  email={userDetails.email}
                  messageContent={userDetails.message}
                />
              );
            } else {
              return <UserMessage key={index} message={message.text} />;
            }
          })}
          {isTyping && <TypingIndicator />}
        </div>

        <div className="flex gap-4 items-center rounded-lg p-4">
          <Input
            type="text"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 h-12"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-primary/35 p-2 rounded-full h-12 w-12 hover:bg-primary/25 transition-colors cursor-pointer flex items-center justify-center"
          >
            <SendHorizontal className="text-inherit" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactMe;
