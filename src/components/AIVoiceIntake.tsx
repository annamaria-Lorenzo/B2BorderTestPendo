import React, { useState, useEffect, useRef } from "react";
import { User, AIAgentMessage, IntakeItem } from "../types";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  PlusCircle,
  FileText,
  Volume2,
  VolumeX,
  CheckCircle2,
  Package,
  Wand2,
  Layers,
} from "lucide-react";

interface AIVoiceIntakeProps {
  currentUser: User;
  onIntakeUpdated: (newList: IntakeItem[]) => void;
  onNavigateTab: (tab: "voice" | "catalog" | "intake" | "orders") => void;
}

export const AIVoiceIntake: React.FC<AIVoiceIntakeProps> = ({
  currentUser,
  onIntakeUpdated,
  onNavigateTab,
}) => {
  const [messages, setMessages] = useState<AIAgentMessage[]>([
    {
      id: "msg-welcome",
      sender: "agent",
      text: `Hello ${currentUser.name}! I am Apex Sales AI, your industrial hardware intake specialist. You can speak into your microphone or type below. Ask for technical specs, or describe what you need (e.g., "I need 1,000 concealed soft-close European hinges in satin nickel and 20 boxes of M4x30 assembly screws for our furniture project"). I will automatically extract SKUs, calculate volume pricing, and update your intake list.`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [lastExtractedItems, setLastExtractedItems] = useState<any[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Setup Web Speech API for Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInputQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Speech recognition is not supported in this browser. You can type your request directly into the prompt box.",
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInputQuery("");
      recognitionRef.current.start();
    }
  };

  const handleSpeechSynthesis = (text: string) => {
    if (!speechEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isLoading) return;

    const userMsg: AIAgentMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-6),
        }),
      });

      const data = await res.json();

      const agentMsg: AIAgentMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: "agent",
        text: data.replyText || "Processed your request.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        extractedItems: data.extractedItems || [],
        suggestedAction: data.suggestedAction || "none",
      };

      setMessages((prev) => [...prev, agentMsg]);

      if (data.extractedItems && data.extractedItems.length > 0) {
        setLastExtractedItems(data.extractedItems);
      }

      if (data.currentIntakeList) {
        onIntakeUpdated(data.currentIntakeList);
      }

      // Track AI intake query completion
      if ((window as any).pendo) {
        const extractedSkus = (data.extractedItems || [])
          .map((item: any) => item.sku)
          .join(", ")
          .substring(0, 100);
        (window as any).pendo.track("ai_intake_query_completed", {
          input_method: textToSend ? "quick_prompt" : "manual_input",
          extracted_items_count: (data.extractedItems || []).length,
          extracted_skus: extractedSkus,
          suggested_action: data.suggestedAction || "none",
          conversation_length: messages.length + 2,
          account_tier: currentUser.accountTier,
          company_name: currentUser.companyName,
        });
      }

      // Read response aloud if speech is enabled
      handleSpeechSynthesis(data.replyText);
    } catch (err) {
      console.error("Error sending message to AI agent:", err);
      const errorMsg: AIAgentMessage = {
        id: `msg-err-${Date.now()}`,
        sender: "system",
        text: "Unable to connect to AI server. Please verify your connection or try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickVoicePrompts = [
    "I need 15 boxes of 110-degree soft-close European hinges in Satin Nickel",
    "Add 20 boxes of M4x30mm assembly screws for our kitchen cabinet line",
    "What full-extension soft-close drawer slides do you recommend for heavy loads?",
    "I need 50 bags of spiral fluted hardwood dowel pins 8x40mm",
    "Generate an official B2B quote for my current intake list",
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Interactive Voice Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Voice &
                Speech Intake Agent
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">
                Powered by Gemini 3.6 Flash
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Talk or Type Your Commercial Hardware Request
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Speak naturally about your furniture production requirements. Our
              AI parses technical specs, searches our catalog, applies{" "}
              <strong className="text-slate-900">
                {currentUser.accountTier}
              </strong>{" "}
              volume pricing, and automatically updates your intake list.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                speechEnabled
                  ? "bg-slate-100 border-slate-200 text-slate-800"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
              title="Toggle AI Speech Voice Response"
            >
              {speechEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {speechEnabled ? "Speech Voice On" : "Speech Voice Off"}
              </span>
            </button>

            <button
              onClick={() => onNavigateTab("intake")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs text-xs flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              View Quote Intake
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat & Voice Studio Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Voice & Chat Window */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl flex flex-col h-[600px] shadow-sm overflow-hidden">
          {/* Chat Messages Log */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                    msg.sender === "user"
                      ? "bg-slate-900 text-white"
                      : msg.sender === "agent"
                        ? "bg-slate-800 text-white shadow-xs"
                        : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <UserIcon className="w-4 h-4" />
                  ) : msg.sender === "agent" ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    "SYS"
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-slate-900 text-white rounded-tr-none"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Extracted SKUs & Items Card inside message */}
                    {msg.extractedItems && msg.extractedItems.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          AI Auto-Extracted Hardware Items (
                          {msg.extractedItems.length}):
                        </div>
                        <div className="space-y-2">
                          {msg.extractedItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between gap-2 text-xs"
                            >
                              <div>
                                <span className="font-bold text-slate-900">
                                  {item.sku}
                                </span>{" "}
                                - {item.name}
                                <div className="text-[11px] text-slate-500">
                                  Qty:{" "}
                                  <strong className="text-slate-800">
                                    {item.quantity}
                                  </strong>{" "}
                                  | Finish:{" "}
                                  <strong className="text-slate-800">
                                    {item.finish || "Standard"}
                                  </strong>
                                </div>
                              </div>
                              <span className="text-emerald-700 font-bold">
                                $
                                {item.unitPrice
                                  ? (item.unitPrice * item.quantity).toFixed(2)
                                  : "Tier Pricing"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-slate-500 text-xs p-2">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center animate-pulse">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-2xl shadow-xs">
                  <span className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-slate-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="ml-2">
                    Analyzing technical specs & stock availability...
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Voice Mic Controls & Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-3">
            {/* Listening Indicator */}
            {isListening && (
              <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center justify-between text-xs text-rose-800 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                  </span>
                  <span className="font-bold">
                    Microphone Active - Speak clearly now...
                  </span>
                </div>
                <button
                  onClick={toggleListening}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold"
                >
                  Stop Recording
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-xl transition-all border flex items-center justify-center ${
                  isListening
                    ? "bg-rose-600 text-white animate-bounce border-rose-700"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                }`}
                title={
                  isListening
                    ? "Stop Speech Recording"
                    : "Start Microphone Speech Input"
                }
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              <input
                type="text"
                placeholder={
                  isListening
                    ? "Listening to speech..."
                    : "Type hardware search or specs (e.g., 500 concealed hinges and 2000 screws)..."
                }
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />

              <button
                type="button"
                disabled={isLoading || !inputQuery.trim()}
                onClick={() => handleSendMessage()}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white p-3 rounded-xl shadow-xs transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Sample Voice Prompts & Extracted Items Panel */}
        <div className="space-y-6">
          {/* Quick Voice Prompts Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" /> Example Voice &
              Speech Prompts
            </h3>
            <p className="text-xs text-slate-500">
              Click any quick phrase to test AI technical parsing and real-time
              intake list generation:
            </p>

            <div className="space-y-2">
              {quickVoicePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 hover:text-slate-900 font-medium transition-all flex items-start gap-2 group"
                >
                  <Mic className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>"{prompt}"</span>
                </button>
              ))}
            </div>
          </div>

          {/* Account B2B Tier Summary Badge */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700" /> Active Account
                Perks
              </span>
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
                {currentUser.accountTier}
              </span>
            </div>

            <div className="text-xs space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Account Discount:</span>
                <strong className="text-amber-800">
                  {currentUser.accountTier.includes("Tier 2")
                    ? "18% Off Catalog"
                    : currentUser.accountTier.includes("Tier 1")
                      ? "10% Off Catalog"
                      : "Standard"}
                </strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Net 30 Limit:</span>
                <strong className="text-emerald-700">
                  ${currentUser.creditLimit.toLocaleString()}
                </strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax Exemption:</span>
                <strong className="text-slate-900">
                  {currentUser.taxExemptNo || "Active"}
                </strong>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("intake")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition-all border border-slate-200"
            >
              Open B2B Quote & Intake List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
