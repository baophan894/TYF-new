'use client';
import { useState, useEffect } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Define types for messages
interface Message {
  text: string;
  role: "user" | "bot";
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [chat, setChat] = useState<any>(null); // Replace 'any' with the appropriate type if known
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "AIzaSyB_P1g4og2h5T92NCV--n0y_l0x13NNGzo"; // Replace with your API Key
  const MODEL_NAME = "gemini-1.0-pro-001";

  const genAI = new GoogleGenerativeAI(API_KEY);

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  useEffect(() => {
    const initChat = async () => {
      try {
        const newChat = await genAI
          .getGenerativeModel({ model: MODEL_NAME })
          .startChat({
            generationConfig,
            safetySettings,
            history: messages.map((msg) => ({
              parts: [{ text: msg.text }], // Adjust this line to match the expected Part structure
              role: msg.role,
            })),
          });
        setChat(newChat);
      } catch (error) {
        
      }
    };
    initChat();
  }, [messages]); // Add messages as a dependency

  const handleSendMessage = async () => {
    if (!userInput) return; // Prevent sending empty messages

    const userMessage: Message = {
      text: userInput,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput("");

    try {
      if (chat) {
        const result = await chat.sendMessage(userInput);
        const botMessage: Message = {
          text: result.response.text(),
          role: "bot",
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      setError("Failed to send message.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      <div className="messages mb-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start mb-4">
            {msg.role === "user" ? (
              <>
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                  alt="user avatar"
                  className="w-11 h-auto"
                />
                <div className="p-3 ml-3 bg-blue-200 rounded-xl">
                  <p className="text-sm mb-0">{msg.text}</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 mr-3 border border-gray-300 bg-gray-50 rounded-xl">
                  <p className="text-sm mb-0">{msg.text}</p>
                </div>
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                  alt="bot avatar"
                  className="w-11 h-auto"
                />
              </>
            )}
          </div>
        ))}
      </div>
      <div className="form-outline">
        <textarea
          className="form-control bg-gray-100 rounded-md border border-gray-300 p-2 w-full"
          rows={4}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message"
        ></textarea>
      </div>
    </>
  );
}
