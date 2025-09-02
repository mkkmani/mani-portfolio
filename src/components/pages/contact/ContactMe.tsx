"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useRef, useEffect } from "react";
import BeginChat from "./BeginChat";
import { SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  getRandomConfirmationMessage,
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

type Message = {
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
  complete: boolean;
  id: string;
};

const BotMessage = ({ message }: { message: string }) => {
  return (
    <div className="p-4 rounded-3xl rounded-bl-none bg-primary/25 max-w-[80%] self-start">
      {message}
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
    <div className="p-4 rounded-3xl rounded-br-none bg-muted-foreground/10 text-foreground max-w-[80%] self-end">
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
};

const ContactMe = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    message: "",
    verification: "",
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

  // Remove this after testing
  useEffect(() => {
    beginChat();
  }, []);

  const beginChat = () => {
    setUserResponse("");
    setIsChatOpen(true);
    setIsTyping(true);

    setTimeout(() => {
      setMessages([botWelcomeMessage]);
    }, 500);

    const { problem, answer } = getRandomVerificationMessage();
    setVerificationAnswer(answer);

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...(prevMessages || []),
        {
          text: problem,
          sender: "bot" as const,
          timestamp: new Date(),
          complete: true,
          id: Date.now().toString(),
        },
      ]);
      setIsTyping(false);
      setCurrentStep("verification");
    }, 1500);
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
    };

    // Add the user's message to the chat immediately
    setMessages((prevMessages) => [...(prevMessages || []), newUserMessage]);
    setUserResponse("");

    // A slight delay before the bot responds to simulate typing
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
              id: Date.now().toString(),
            };
            const newNameMessage: Message = {
              text: getRandomNameMessage(),
              sender: "bot",
              timestamp: new Date(),
              complete: true,
              id: Date.now().toString(),
            };
            setMessages((prevMessages) => [
              ...(prevMessages || []),
              newSuccessMessage,
              newNameMessage,
            ]);
            setCurrentStep("name");
          } else {
            // Incorrect answer
            setVerificationCount((prev) => prev + 1);
            const newFailMessage: Message = {
              text: getRandomVerificationFailMessage(),
              sender: "bot",
              timestamp: new Date(),
              complete: true,
              id: Date.now().toString(),
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
          const newEmailMessage: Message = {
            text: getRandomEmailMessage(),
            sender: "bot",
            timestamp: new Date(),
            complete: true,
            id: Date.now().toString(),
          };
          setMessages((prevMessages) => [
            ...(prevMessages || []),
            newEmailMessage,
          ]);
          setCurrentStep("email");
          break;
        }

        case "email": {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userResponse)) {
            // Invalid email format
            const newInvalidEmailMessage: Message = {
              text: getRandomInvalidEmailMessage(),
              sender: "bot",
              timestamp: new Date(),
              complete: true,
              id: Date.now().toString(),
            };
            setMessages((prevMessages) => [
              ...(prevMessages || []),
              newInvalidEmailMessage,
            ]);
            // Stay on the same step to prompt again
          } else {
            // Valid email
            const newMessageMessage: Message = {
              text: getRandomMessageMessage(),
              sender: "bot",
              timestamp: new Date(),
              complete: true,
              id: Date.now().toString(),
            };
            setMessages((prevMessages) => [
              ...(prevMessages || []),
              newMessageMessage,
            ]);
            setCurrentStep("message");
          }
          break;
        }

        case "message": {
          const newMessageMessage: Message = {
            text: getRandomConfirmationMessage(),
            sender: "bot",
            timestamp: new Date(),
            complete: true,
            id: Date.now().toString(),
          };
          setMessages((prevMessages) => [
            ...(prevMessages || []),
            newMessageMessage,
          ]);
          setCurrentStep("confirmation");
          break;
        }

        case "confirmation": {
          if (userResponse.toLowerCase() === "yes") {
            // User confirmed
            const newConfirmationMessage: Message = {
              text: getRandomGoodbyeMessage(),
              sender: "bot",
              timestamp: new Date(),
              complete: true,
              id: Date.now().toString(),
            };
            setMessages((prevMessages) => [
              ...(prevMessages || []),
              newConfirmationMessage,
            ]);
            setCurrentStep("goodbye");
          } else {
            // User did not confirm, restart the chat
            setMessages([]);
            beginChat();
          }
          break;
        }
      }
    }, 500); // 500ms delay to simulate bot response time
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isChatOpen) {
    return <BeginChat onClick={beginChat} />;
  }

  return (
    <div className="w-full h-full min-h-screen flex-col max-w-xl mx-auto max-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col gap-4 border border-primary/45 bg-card/40 rounded-lg w-full h-[600px]">
        <div
          id="header"
          className="flex flex-col gap-2 bg-primary/25 p-4 rounded-t-lg"
        >
          <h1 className="text-2xl font-bold">Hey there, Human! 👋</h1>
          <p className="text-muted-foreground">
            Got something on your mind? Let’s chat! 🎉 I promise I won’t bite...
            unless you send me an unsolicited pizza emoji 🍕.
          </p>
        </div>

        <div
          ref={messagesEndRef}
          className="flex flex-col gap-6 overflow-y-auto flex-1 pb-36 p-4"
        >
          {messages?.map((message, index) => {
            if (message.sender === "bot") {
              return <BotMessage key={index} message={message.text} />;
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
