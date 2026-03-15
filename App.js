import React, { useState, useEffect, useRef } from 'react';
// Note: Ensure 'lucide-react' is installed: npm install lucide-react
import { Send, RotateCcw, Globe, ExternalLink, ShieldCheck, User, Bot } from 'lucide-react';

export default function GovAssistant() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: 'Namaste! I am your Citizen Assistant. I can help you find government services, check eligibility for schemes, or list required documents. What can I do for you?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Requirement 4: Session Management - Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Requirement 4.3: Reset Session
  const resetSession = () => {
    setMessages([{ 
      id: Date.now(), 
      type: 'bot', 
      text: 'Session reset. All temporary data cleared. How can I help you start fresh?' 
    }]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulated Backend Logic (Requirement 1, 2, & 3)
    setTimeout(() => {
      let botResponse = { text: "I'm looking into that. Could you please specify your state or the specific department?" };
      
      const query = input.toLowerCase();
      if (query.includes('passport')) {
        botResponse = {
          text: "To apply for a fresh Passport, you must register at the Passport Seva Portal. Here are the mandatory documents:",
          docs: [
            { name: "Aadhaar Card", status: "Mandatory", desc: "Proof of Identity & Address", link: "https://uidai.gov.in" },
            { name: "Birth Certificate", status: "Mandatory", desc: "Proof of Date of Birth", link: "#" },
            { name: "Electricity Bill", status: "Conditional", desc: "Required if Aadhaar address is old", link: "#" }
          ]
        };
      } else if (query.includes('scheme') || query.includes('eligible')) {
        botResponse = {
          text: "I can help check eligibility. Are you asking for: 1. PM-Kisan (Farmers), 2. PMAY (Housing), or 3. Student Scholarships?",
        };
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', ...botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-4xl mx-auto bg-slate-50 md:h-[92vh] md:my-4 md:rounded-3xl md:shadow-2xl overflow-hidden border border-slate-200 font-sans">
      
      {/* HEADER: Requirement 5 (Accessibility/Language) */}
      <header className="bg-indigo-700 text-white p-4 md:p-6 flex justify-between items-center shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-xl tracking-tight leading-none">GovAssistant</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[10px] md:text-xs font-medium opacity-80 uppercase">Official Support Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={resetSession}
          className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/25 px-4 py-2 rounded-full border border-white/20 transition-all active:scale-95"
        >
          <RotateCcw size={14} /> <span className="hidden sm:inline">RESET SESSION</span>
        </button>
      </header>

      {/* CHAT AREA: Responsive & Scannable */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
            {/* Avatar Icons */}
            <div className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm ${msg.type === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-400 border border-slate-200'}`}>
              {msg.type === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>

            {/* Bubble */}
            <div className={`relative max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm ${
              msg.type === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <p className="text-sm md:text-base leading-relaxed font-medium">{msg.text}</p>

              {/* Requirement 3: Structured Document Lists */}
              {msg.docs && (
                <div className="mt-4 space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Required Documentation</p>
                  {msg.docs.map((doc, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                      <div className="pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${doc.status === 'Mandatory' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{doc.desc}</p>
                      </div>
                      <a href={doc.link} target="_blank" rel="noreferrer" className="shrink-0 p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center animate-pulse">
              <Bot size={16} />
            </div>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      {/* FOOTER: Accessible Input Area */}
      <footer className="p-4 md:p-6 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSend} className="flex gap-3 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can I help you today?"
              className="w-full bg-slate-100 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm md:text-base focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
              aria-label="Government query input"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hidden md:block">
              <ShieldCheck size={20} />
            </div>
          </div>
          <button 
            type="submit"
            disabled={!input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-5 md:px-7 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center"
          >
            <Send size={20} className={input.trim() ? "animate-pulse" : ""} />
          </button>
        </form>
        <div className="mt-4 flex justify-center items-center gap-6 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>Data Privacy Protected</span>
          <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
          <span>Official Portal Links Only</span>
        </div>
      </footer>
    </div>
  );
}