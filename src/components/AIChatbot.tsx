"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, Phone, ChevronDown, MapPin, Calendar, BedDouble, RotateCcw } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  isBookingWidget?: boolean;
}

const QUICK_PROMPTS = [
  "📅 Book A Room Now",
  "🌟 Why choose Krishna Hotel?",
  "🏨 What facilities do you offer?",
  "📍 How far is Ayodhya & Ram Mandir?",
  "🛏️ What room types & rates are available?",
  "🍽️ Is pure veg food available?",
  "🎉 Banquet Hall & Event booking info",
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Namaste! Jai Shree Ram! 🙏 Welcome to **Krishna Hotel & Restaurant**.\n\nI am your AI Concierge! Ask me anything about our **rooms (₹999 - ₹1,500)**, **facilities**, **pure veg restaurant**, or click below to **book a room instantly**.\n\nHow may I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // In-Chat Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    roomType: "Standard Ac Room",
    checkIn: "",
    checkOut: "",
    guests: "2",
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("openAIChat", handleOpenChat);
    return () => window.removeEventListener("openAIChat", handleOpenChat);
  }, []);

  const triggerScrollToContact = () => {
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-1",
        sender: "bot",
        text: "Namaste! Jai Shree Ram 🙏 Welcome to **Krishna Hotel & Restaurant**.\n\nI am your AI Concierge! Ask me anything about our **rooms (₹999 - ₹1,500)**, **facilities**, **pure veg restaurant**, or click below to **book a room instantly**.\n\nHow may I assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setBookingConfirmed(false);
    toast.success("Chat cleared!");
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const isBookingRequest =
      query.includes("Book A Room") ||
      query.toLowerCase().includes("book now") ||
      query.toLowerCase().includes("reserve") ||
      query.toLowerCase().includes("booking");

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    if (isBookingRequest) {
      setTimeout(() => {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "I can help you reserve a room right here, or direct you to our full reservation form! Fill out the quick details below:",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isBookingWidget: true,
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
      }, 400);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || "I am currently unable to fetch that. Please call us at +91 86046 80149!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Apologies! I encountered a connection issue. You can reach us directly on WhatsApp or call [**+91 86046 80149**](tel:+918604680149).",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInlineBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameTrimmed = bookingForm.name.trim();
    if (!nameTrimmed || nameTrimmed.length < 2 || !/^[a-zA-Z\s]+$/.test(nameTrimmed)) {
      toast.error("Please enter a valid name (letters only, min 2 characters).");
      return;
    }

    const phoneTrimmed = bookingForm.phone.trim();
    const digitsOnly = phoneTrimmed.replace(/\D/g, "");

    // Validate 10-digit mobile number or +91 10-digit format
    const isValidPhone =
      (digitsOnly.length === 10 && /^[6-9]\d{9}$/.test(digitsOnly)) ||
      (digitsOnly.length === 12 && digitsOnly.startsWith("91") && /^[6-9]\d{9}$/.test(digitsOnly.slice(2))) ||
      (digitsOnly.length >= 10 && digitsOnly.length <= 13);

    if (!phoneTrimmed || !isValidPhone) {
      toast.error("Please enter a valid 10-digit phone number (e.g. 9876543210 or +919876543210).");
      return;
    }

    setIsSubmittingBooking(true);

    try {
      const checkInDate = bookingForm.checkIn || new Date().toISOString().split("T")[0];
      const checkOutDate = bookingForm.checkOut || new Date(new Date(checkInDate).getTime() + 86400000).toISOString().split("T")[0];

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameTrimmed,
          phone: phoneTrimmed,
          email: "booking-via-ai-chatbot@krishnaahotel.in",
          roomType: bookingForm.roomType,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: bookingForm.guests || "2",
          message: `Instant AI Chatbot Booking Request for ${bookingForm.roomType}.`,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Booking submission failed.");
      }

      setBookingConfirmed(true);
      toast.success("Booking Request Confirmed! Our team will call you shortly.");

      // Also trigger event to populate site form
      window.dispatchEvent(
        new CustomEvent("roomSelected", { detail: bookingForm.roomType })
      );

      const confirmMsg: Message = {
        id: (Date.now() + 2).toString(),
        sender: "bot",
        text: `🎉 **Booking Request Received!**\n\n• **Guest**: ${nameTrimmed}\n• **Phone**: ${phoneTrimmed}\n• **Room**: ${bookingForm.roomType}\n• **Check-in**: ${checkInDate}\n• **Check-out**: ${checkOutDate}\n\nOur front desk will call you at **${phoneTrimmed}** shortly to confirm your room.\n\n📲 [Confirm Instantly via WhatsApp](https://wa.me/918604680149?text=Hi%20Krishna%20Hotel,%20I%20requested%20a%20booking%20for%20${encodeURIComponent(bookingForm.roomType)})`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, confirmMsg]);
    } catch (err: any) {
      console.error("Chatbot booking submission error:", err);
      toast.error(err.message || "Failed to submit booking. Please call +91 86046 80149!");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Structured Markdown & Button Renderer
  const renderFormattedText = (content: string, isUser: boolean) => {
    if (isUser) {
      return <p className="leading-relaxed font-normal">{content}</p>;
    }

    const lines = content.split("\n");

    return (
      <div className="space-y-1 text-xs sm:text-sm text-gray-800">
        {lines.map((line, lIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lIdx} className="h-1" />;

          const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-");
          const isNumber = /^\d+\.\s/.test(trimmed);
          const lineText = isBullet
            ? trimmed.substring(1).trim()
            : isNumber
              ? trimmed.replace(/^\d+\.\s/, "").trim()
              : trimmed;

          const renderLineContent = (text: string) => {
            const tokenRegex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
            const parts = text.split(tokenRegex);

            return parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={pIdx} className="font-bold text-gray-900">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith("[") && part.includes("](")) {
                const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                if (linkMatch) {
                  const [, label, href] = linkMatch;
                  const isWhatsApp = href.includes("wa.me");
                  const isPhone = href.startsWith("tel:");
                  return (
                    <a
                      key={pIdx}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all my-1 shadow-sm ${isWhatsApp
                          ? "bg-[#25D366] text-white hover:bg-[#20BE5A]"
                          : isPhone
                            ? "bg-royal-blue text-white hover:bg-royal-blue-light"
                            : "bg-royal-blue/10 text-royal-blue hover:bg-royal-blue/20"
                        }`}
                    >
                      {isWhatsApp && <span>💬</span>}
                      {isPhone && <span>📞</span>}
                      <span>{label}</span>
                    </a>
                  );
                }
              }
              return part;
            });
          };

          if (isBullet) {
            return (
              <div key={lIdx} className="flex items-start gap-2 my-1.5 pl-0.5">
                <span className="text-royal-blue font-bold text-base leading-none mt-0.5">•</span>
                <div className="flex-1 leading-relaxed">{renderLineContent(lineText)}</div>
              </div>
            );
          }

          if (isNumber) {
            return (
              <div key={lIdx} className="flex items-start gap-2 my-1.5 pl-0.5">
                <span className="text-royal-blue font-bold text-xs bg-royal-blue/10 px-1.5 py-0.5 rounded">
                  {trimmed.match(/^\d+/)?.[0]}
                </span>
                <div className="flex-1 leading-relaxed">{renderLineContent(lineText)}</div>
              </div>
            );
          }

          return (
            <div key={lIdx} className="my-1 leading-relaxed">
              {renderLineContent(lineText)}
            </div>
          );
        })}
      </div>
    );
  };

  const today = new Date().toISOString().split("T")[0];
  const minCheckOut = bookingForm.checkIn
    ? new Date(new Date(bookingForm.checkIn).getTime() + 86400000).toISOString().split("T")[0]
    : today;

  return (
    <>
      {/* Floating AI Assistant Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 md:bottom-6 left-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-red-600 via-royal-blue to-gold p-3 text-white shadow-2xl hover:scale-105 transition-all duration-300 group border-2 border-white/30"
          aria-label="Open AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="h-6 w-6 animate-pulse text-gold" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <span className="hidden sm:inline font-semibold text-sm pr-1">
            Ask Krishna AI
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[420px] h-[620px] max-h-[88vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">

          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 via-royal-blue to-gray-900 p-3.5 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/20 shrink-0">
                <Image
                  src="/logo-transparent.png"
                  alt="Krishna Hotel Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-900"></span>
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5 font-heading tracking-wide">
                  Krishna AI Assistant <Sparkles className="h-4 w-4 text-gold" />
                </h3>
                <p className="text-xs text-gray-300">Online • Hotel Facilities & Booking Concierge</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  triggerScrollToContact();
                }}
                className="hidden sm:inline-flex items-center gap-1 bg-gold text-gray-900 font-bold text-xs px-2.5 py-1 rounded-lg hover:bg-gold-light transition-colors"
                title="Go to Full Reservation Form"
              >
                <Calendar className="h-3.5 w-3.5" /> Book
              </button>
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                title="Clear Chat History"
              >
                <RotateCcw className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                title="Minimize Chat"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                title="Close Chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-amber-50 px-3.5 py-2 border-b border-amber-200 text-xs text-amber-900 flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1.5 font-medium truncate">
              <MapPin className="h-3.5 w-3.5 text-red-600 shrink-0" /> Ayodhya Highway, Ambedkar Nagar
            </span>
            <button
              onClick={() => {
                triggerScrollToContact();
              }}
              className="font-bold text-royal-blue hover:underline flex items-center gap-1 shrink-0 ml-2 bg-white px-2 py-0.5 rounded border border-royal-blue/20"
            >
              <Calendar className="h-3 w-3" /> Form
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-4 shadow-sm text-sm ${msg.sender === "user"
                      ? "bg-royal-blue text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-200/80 rounded-tl-none"
                    }`}
                >
                  <div className="text-[11px] font-semibold mb-2 opacity-70 flex items-center justify-between gap-4 border-b border-gray-100 pb-1">
                    <span>{msg.sender === "user" ? "You" : "Krishna Hotel Concierge"}</span>
                    <span className="text-[10px] font-normal">{msg.timestamp}</span>
                  </div>
                  <div>{renderFormattedText(msg.text, msg.sender === "user")}</div>

                  {/* Interactive Booking Widget embedded in chat */}
                  {msg.isBookingWidget && !bookingConfirmed && (
                    <form
                      onSubmit={handleInlineBookingSubmit}
                      className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-3 text-xs text-gray-900"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <span className="font-bold text-royal-blue flex items-center gap-1">
                          <BedDouble className="h-4 w-4" /> Instant Room Booking
                        </span>
                        <span className="text-[10px] text-gray-500">₹999 - ₹1,500</span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">Your Full Name (Letters only)</label>
                        <input
                          type="text"
                          required
                          value={bookingForm.name}
                          onChange={(e) => {
                            const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                            setBookingForm({ ...bookingForm, name: lettersOnly });
                          }}
                          placeholder="e.g. Krishna Hotel"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-royal-blue focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">Phone Number (10 digits / +91)</label>
                        <input
                          type="tel"
                          required
                          value={bookingForm.phone}
                          onChange={(e) => {
                            const val = e.target.value;
                            const cleaned = val.startsWith("+")
                              ? "+" + val.slice(1).replace(/\D/g, "")
                              : val.replace(/\D/g, "");
                            if (cleaned.length <= 14) {
                              setBookingForm({ ...bookingForm, phone: cleaned });
                            }
                          }}
                          placeholder="e.g. 9876543210 or +919876543210"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-royal-blue focus:outline-none bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Check-in Date</label>
                          <input
                            type="date"
                            min={today}
                            value={bookingForm.checkIn}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBookingForm((prev) => {
                                const nextMinOut = val ? new Date(new Date(val).getTime() + 86400000).toISOString().split("T")[0] : today;
                                const newOut = prev.checkOut && prev.checkOut <= val ? nextMinOut : prev.checkOut;
                                return { ...prev, checkIn: val, checkOut: newOut };
                              });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-2 py-2 text-xs focus:border-royal-blue focus:outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Check-out Date</label>
                          <input
                            type="date"
                            min={minCheckOut}
                            value={bookingForm.checkOut}
                            onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-2 py-2 text-xs focus:border-royal-blue focus:outline-none bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">Select Room Type</label>
                        <select
                          value={bookingForm.roomType}
                          onChange={(e) => setBookingForm({ ...bookingForm, roomType: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-royal-blue focus:outline-none bg-white"
                        >
                          <option value="Standard Ac Room">Standard Ac Room (₹1,200)</option>
                          <option value="Super-Deluxe Room">Super-Deluxe Room (₹1,500)</option>
                          <option value="Non-Ac Deluxe">Non-Ac Deluxe (₹999)</option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={isSubmittingBooking}
                          className="flex-1 bg-royal-blue text-white font-bold py-2 rounded-lg text-xs hover:bg-royal-blue-light transition-colors flex items-center justify-center gap-1 shadow-sm"
                        >
                          {isSubmittingBooking ? "Booking..." : "Confirm Booking Request"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            triggerScrollToContact();
                          }}
                          className="bg-white text-gray-700 font-semibold px-2.5 py-2 rounded-lg text-xs border border-gray-300 hover:bg-gray-100"
                          title="Open Full Website Form"
                        >
                          Website Form ↗
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center gap-2.5">
                  <Bot className="h-4 w-4 text-royal-blue animate-bounce" />
                  <span className="text-xs text-gray-600 font-medium">Krishna AI is preparing details...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="p-2.5 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all shrink-0 shadow-2xs ${prompt.includes("Book")
                    ? "bg-royal-blue text-white border-royal-blue hover:bg-royal-blue-light"
                    : "bg-gray-100 hover:bg-royal-blue hover:text-white text-gray-700 border-gray-200"
                  }`}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about rooms, facilities, or type 'Book'..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue disabled:bg-gray-50 placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-xl bg-royal-blue px-3.5 py-2.5 text-white hover:bg-royal-blue-light disabled:opacity-50 transition-colors shrink-0 font-semibold text-xs flex items-center gap-1.5 shadow-sm"
              title="Send Message"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
