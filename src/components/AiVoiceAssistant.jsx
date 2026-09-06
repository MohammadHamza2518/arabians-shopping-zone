import React, { useState, useEffect, useRef } from 'react';
import { useConversation, ConversationProvider } from '@elevenlabs/react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  ShoppingBag, 
  ArrowRight,
  Clock,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

function AiVoiceAssistantContent() {
  const { addToCart, showToast } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('call'); // 'call' | 'chat'
  
  // Call Timer & State
  const [callDuration, setCallDuration] = useState(0); // in seconds
  const [callWarning, setCallWarning] = useState(false);
  const [callEndedReason, setCallEndedReason] = useState('');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [poolInfo, setPoolInfo] = useState(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: "Assalamu Alaikum! Main Bilal bol raha hoon Arabians Shopping Zone se. Farmayein bhai, aaj aapke liye Sunnah Talbina, Royal Thobes ya Attar me kya dekhna chahenge?",
      time: 'Just now',
      recommendations: [],
      quickPrompts: ['Talbina ke kya fayde hain?', 'Saudi Thobe size guide', 'Shop kahan par hai?', 'Parcel track karein']
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // ElevenLabs Conversation Hook
  const conversation = useConversation({
    onConnect: () => {
      setCallEndedReason('');
      setSessionError('');
      setCallDuration(0);
      setCallWarning(false);
      // Start 100-second timer
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setCallDuration(prev => {
          const next = prev + 1;
          if (next >= 85 && !callWarning) {
            setCallWarning(true);
          }
          if (next >= 100) { // 1 min 40 seconds exact limit!
            handleEndCall("Call completed (1:40 min limit reached). JazakAllah Khair!");
          }
          return next;
        });
      }, 1000);
    },
    onDisconnect: () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    },
    onError: (err) => {
      console.error("ElevenLabs Call Error:", err);
      setSessionError("Voice call issue. Switching connection...");
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  });

  const isConnected = conversation.status === 'connected';
  const isConnecting = conversation.status === 'connecting';
  const isSpeaking = conversation.isSpeaking;

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      try {
        if (conversation && conversation.status === 'connected') {
          conversation.endSession();
        }
      } catch (e) {}
    };
  }, []);

  // Auto scroll chat
  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping, activeTab]);

  // Start Live Voice Call
  const handleStartCall = async () => {
    setSessionError('');
    setCallEndedReason('');
    try {
      // 1. Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Fetch signed URL from our backend with auto-failover pool
      const res = await fetch('/api/ai-agent/session');
      const data = await res.json();

      if (!data.success || !data.signedUrl) {
        throw new Error(data.error || "Failed to get voice session");
      }

      setPoolInfo(`Key #${data.poolIndex}/${data.totalInPool}`);

      // 3. Connect via ElevenLabs Conversation SDK
      await conversation.startSession({
        signedUrl: data.signedUrl
      });
    } catch (err) {
      console.error("Start Call Failed:", err);
      setSessionError(err.message.includes('Permission') 
        ? "Microphone access denied. Please allow mic in browser to speak with Bilal Bhai." 
        : "Failed to connect to voice engine. Please check internet or try text chat below.");
    }
  };

  // End Live Voice Call
  const handleEndCall = async (reason = '') => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (reason) setCallEndedReason(reason);
    try {
      await conversation.endSession();
    } catch (e) {}
  };

  // Format timer MM:SS
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle Text Chat Submit
  const handleSendMessage = async (textToSend) => {
    const q = (textToSend || chatInput).trim();
    if (!q) return;

    // Append user message
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: q, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();

      setIsTyping(false);
      if (data.success) {
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: data.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            recommendations: data.recommendations || [],
            quickPrompts: data.quickPrompts || []
          }
        ]);
      }
    } catch (err) {
      setIsTyping(false);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "Bhai connection me thodi dikkat aayi. Aap WhatsApp par +91 92360 28318 par direct rabta qayam kar sakte hain.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <>
      {/* 🌟 1. Floating Royal Trigger Button (Bottom-Left so it NEVER overlaps with WhatsApp on bottom-right) */}
      <div className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40 flex flex-col items-start gap-2">
        {!isOpen && (
          <div className="animate-bounce bg-slate-950/90 text-[#f5d77f] text-[11px] font-bold px-3 py-1 rounded-full shadow-lg border border-amber-500/40 backdrop-blur flex items-center gap-1.5 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Call Bilal Bhai (Live AI)
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Arabians Voice AI Assistant"
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#072418] via-[#0d3b27] to-[#04160e] text-white shadow-2xl border border-[#d4af37]/60 hover:border-[#f7e7a7] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {/* Animated Gold Aura Ring */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400/20 via-emerald-400/20 to-amber-500/20 blur-sm group-hover:blur group-hover:opacity-100 transition duration-500"></span>

          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-inner">
            {isOpen ? <X className="w-5 h-5" /> : <PhoneCall className="w-4 h-4 animate-pulse" />}
          </div>

          <div className="relative text-left pr-1 hidden xs:block">
            <div className="text-[12px] font-serif font-black tracking-wide text-amber-200 flex items-center gap-1">
              <span>Bilal Bhai</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-sans font-bold px-1.5 py-0.2 rounded border border-emerald-500/30 uppercase">Voice AI</span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium">Sunnah & Store Advisor</div>
          </div>
        </button>
      </div>

      {/* 🌟 2. Interactive Voice & Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full sm:max-w-md h-[90vh] sm:h-[650px] bg-[#06140e] border border-amber-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
            
            {/* Header */}
            <div className="relative px-5 py-4 bg-gradient-to-r from-[#092218] via-[#0d3324] to-[#06160f] border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-amber-300 to-amber-600 p-0.5 shadow-md">
                    <div className="w-full h-full rounded-full bg-[#071d14] flex items-center justify-center text-xl">
                      👑
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#06140e] rounded-full shadow"></span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-black text-base text-amber-200 tracking-wide">Brother Bilal</h3>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                      Store Head
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Speaks Pure Hindi, Urdu & Hinglish
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mode Selector Tabs (Voice Call vs Text Chat) */}
            <div className="grid grid-cols-2 bg-[#040e0a] p-1 border-b border-amber-500/20 text-xs font-bold">
              <button
                onClick={() => setActiveTab('call')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition ${
                  activeTab === 'call'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Live Voice Call</span>
                {isConnected && <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>}
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Text Chat</span>
              </button>
            </div>

            {/* ==================== TAB 1: LIVE VOICE CALL ==================== */}
            {activeTab === 'call' && (
              <div className="flex-1 flex flex-col items-center justify-between p-6 overflow-y-auto text-center">
                
                {/* Status Notice */}
                <div className="w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Real Human Voice • Order, Track & Shop Info</span>
                  </div>

                  {poolInfo && (
                    <div className="mt-1 text-[10px] text-slate-400 font-mono">
                      Pool Active: {poolInfo}
                    </div>
                  )}
                </div>

                {/* Pulsing Visualizer & Avatar Circle */}
                <div className="relative my-6 flex items-center justify-center">
                  {/* Glowing Sound Rings when Speaking */}
                  {isSpeaking && (
                    <>
                      <div className="absolute w-44 h-44 rounded-full bg-amber-400/20 animate-ping pointer-events-none"></div>
                      <div className="absolute w-56 h-56 rounded-full bg-emerald-500/10 animate-pulse pointer-events-none"></div>
                    </>
                  )}

                  <div className={`relative w-32 h-32 rounded-full p-1 transition-all duration-500 ${
                    isConnected
                      ? isSpeaking
                        ? 'bg-gradient-to-tr from-amber-400 via-emerald-400 to-amber-500 ring-4 ring-amber-400/40 shadow-2xl scale-105'
                        : 'bg-emerald-500/50 ring-2 ring-emerald-400/30'
                      : 'bg-slate-700/50'
                  }`}>
                    <div className="w-full h-full rounded-full bg-[#072418] flex flex-col items-center justify-center overflow-hidden">
                      <span className="text-4xl">👳🏽‍♂️</span>
                      <span className="text-[10px] font-serif text-amber-300 font-black mt-1">Bilal Bhai</span>
                    </div>
                  </div>
                </div>

                {/* Call Status Text & Live Timer */}
                <div className="space-y-2 max-w-xs">
                  {isConnected ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {isSpeaking ? 'Bilal Bhai is speaking...' : 'Listening to you... Speak freely!'}
                      </div>
                      
                      {/* Live 1:40 min countdown timer */}
                      <div className="flex items-center justify-center gap-1.5 text-xl font-mono font-black text-amber-300">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>{formatTimer(callDuration)}</span>
                        <span className="text-xs text-slate-400 font-normal">/ 01:40</span>
                      </div>

                      {callWarning && (
                        <div className="text-[11px] text-amber-300 bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-400/40 animate-pulse">
                          ⏱️ Call wrapping up in 15 seconds (credit limit protection).
                        </div>
                      )}
                    </div>
                  ) : isConnecting ? (
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                      <p className="text-xs font-semibold text-slate-300">Connecting to Brother Bilal...</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <h4 className="font-serif font-black text-lg text-white">Tap Call To Start</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Call par aap <strong>Order Track</strong>, <strong>Shop Location</strong>, ya <strong>COD Order Book</strong> karwa sakte hain!
                      </p>
                    </div>
                  )}

                  {sessionError && (
                    <div className="text-[11px] text-rose-300 bg-rose-950/50 p-2.5 rounded-xl border border-rose-800/40">
                      {sessionError}
                    </div>
                  )}

                  {callEndedReason && (
                    <div className="text-[11px] text-emerald-300 bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-800/40">
                      {callEndedReason}
                    </div>
                  )}
                </div>

                {/* Quick Topics Pill Strip */}
                {!isConnected && (
                  <div className="w-full pt-4">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">You can ask:</div>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      <span className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-slate-300">
                        📍 Shop location kahan hai?
                      </span>
                      <span className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-slate-300">
                        📦 Mera order track karo
                      </span>
                      <span className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-slate-300">
                        🛍️ Call pe order book kar do
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons (Start Call / End Call) */}
                <div className="w-full pt-6 flex items-center justify-center gap-4">
                  {isConnected ? (
                    <>
                      <button
                        onClick={() => setIsMicMuted(!isMicMuted)}
                        className={`p-4 rounded-full border transition ${
                          isMicMuted
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        }`}
                        title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
                      >
                        {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={() => handleEndCall("Call ended by customer. JazakAllah Khair!")}
                        className="flex-1 max-w-[200px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-900/40 flex items-center justify-center gap-2 transition active:scale-95"
                      >
                        <PhoneOff className="w-4 h-4" />
                        <span>End Call</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleStartCall}
                      disabled={isConnecting}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 transition active:scale-95"
                    >
                      <PhoneCall className="w-5 h-5" />
                      <span>{isConnecting ? 'Connecting...' : 'Call Bilal Bhai (Free)'}</span>
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* ==================== TAB 2: TEXT CHAT ==================== */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                
                {/* Messages Stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start items-start'}`}
                    >
                      {msg.sender === 'bot' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs shrink-0 shadow">
                          👳🏽‍♂️
                        </div>
                      )}

                      <div className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-tr-none shadow-md'
                          : 'bg-[#0b2418] border border-amber-500/30 text-slate-200 rounded-tl-none shadow-lg'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>

                        {/* Product Recommendations inside Chat */}
                        {msg.recommendations && msg.recommendations.length > 0 && (
                          <div className="pt-2 border-t border-white/10 space-y-1.5">
                            <div className="text-[10px] uppercase font-bold text-amber-300">Recommended Products:</div>
                            <div className="grid grid-cols-1 gap-1.5">
                              {msg.recommendations.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-amber-500/20">
                                  <div className="flex items-center gap-2">
                                    <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded-lg" />
                                    <div>
                                      <div className="text-[11px] font-bold text-white line-clamp-1">{p.name}</div>
                                      <div className="text-[10px] text-amber-300 font-mono font-bold">₹{p.price}</div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      addToCart(p);
                                      if (showToast) showToast(`Added ${p.name} to cart!`);
                                    }}
                                    className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] rounded-lg shadow"
                                  >
                                    + Add
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quick Prompts */}
                        {msg.quickPrompts && msg.quickPrompts.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1">
                            {msg.quickPrompts.map((pill, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={() => handleSendMessage(pill)}
                                className="text-[10px] bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full transition"
                              >
                                {pill} &rarr;
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="text-[9px] text-slate-400 text-right font-mono">{msg.time}</div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-2 items-center text-xs text-amber-300 pl-9 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
                      <span className="text-[11px] text-slate-400 ml-1">Bilal Bhai is typing...</span>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(chatInput);
                  }}
                  className="p-3 bg-[#040e0a] border-t border-amber-500/30 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type Hindi/Hinglish question (e.g. Talbina benefits)..."
                    className="flex-1 bg-[#092218] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition shadow"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            )}

            {/* Footer Notice */}
            <div className="px-4 py-2 bg-[#030a07] border-t border-white/5 text-center text-[10px] text-slate-400 flex items-center justify-between">
              <span>Arabians Halal Guaranteed</span>
              <span>100s Limit Auto-Protection</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default function AiVoiceAssistant() {
  return (
    <ConversationProvider>
      <AiVoiceAssistantContent />
    </ConversationProvider>
  );
}
