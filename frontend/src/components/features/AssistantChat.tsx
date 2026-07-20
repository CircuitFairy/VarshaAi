"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Mic, Sparkles, X, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  isThinking?: boolean;
}

export function AssistantChat({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "I've analyzed the real-time data integration for the Indian subcontinent. An anomalous low-pressure system is forming off the eastern coast, indicating a 78% probability of severe cyclonic activity within 72 hours.",
    },
    {
      id: "2",
      sender: "user",
      text: "Isolate the specific coastal regions at highest risk and project the potential flood inundation zones.",
    },
    {
      id: "3",
      sender: "bot",
      text: "Calculating telemetry...",
      isThinking: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), sender: "user", text: inputValue };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Recalibrating XGBoost neural engine models for specified coastal vector. High-risk zones identified: Balasore, Bhadrak, and Kendrapada districts in Odisha.",
        },
      ]);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="w-96 glass rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-muted/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">VarshaAI Assistant</h3>
            <p className="text-[10px] text-tertiary font-data">ONLINE • SYNCHRONIZED</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar max-h-80 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                msg.sender === "bot"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-[#7701d0]/20 text-[#dcb8ff] border border-[#7701d0]/30"
              }`}
            >
              {msg.sender === "bot" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                msg.sender === "bot"
                  ? "bg-muted border border-border text-foreground"
                  : "bg-[#1c2b3c] border border-primary/30 text-foreground"
              }`}
            >
              {msg.isThinking ? (
                <div className="flex items-center gap-2 text-muted-foreground font-data">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  {msg.text}
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Chips */}
      <div className="px-4 py-2 border-t border-border/30 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <button className="px-3 py-1 rounded-full bg-muted border border-border text-[10px] text-primary font-medium whitespace-nowrap hover:bg-[#1c2b3c] transition-colors flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Explain this prediction
        </button>
        <button className="px-3 py-1 rounded-full bg-muted border border-border text-[10px] text-primary font-medium whitespace-nowrap hover:bg-[#1c2b3c] transition-colors">
          Show flood risk
        </button>
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-border/50 bg-muted">
        <div className="relative flex items-center">
          <button className="absolute left-3 text-muted-foreground hover:text-foreground transition-colors">
            <Mic className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Query simulation data or request analysis..."
            className="w-full bg-muted border border-border rounded-xl pl-9 pr-10 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 p-1.5 rounded-lg bg-primary text-background hover:brightness-110 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
