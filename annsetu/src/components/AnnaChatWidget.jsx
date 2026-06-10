import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { chatWithAnna } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AnnaChatWidget = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = user 
        ? `Hi ${user.name.split(' ')[0]}! I'm Anna, your Annsetu AI assistant. How can I help you today?` 
        : `Hi there! I'm Anna, your Annsetu AI assistant. How can I help you today?`;
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [isOpen, messages.length, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Don't render anything if the user isn't logged in (since API is protected)
  if (!isAuthenticated) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue.trim() };
    
    // Optimistically update UI
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Send the entire conversation history (excluding the very first greeting if you want, but sending it is fine)
      const { data } = await chatWithAnna({
        message: userMessage.content,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });

      if (data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error("Chat response failed");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isError: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-orange-500 to-red-500 p-4 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-xs">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Anna</h3>
                  <p className="text-orange-100 text-xs font-medium flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                    </span>
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#faf8f5] space-y-4">
              {messages.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-orange-100 text-orange-600' : 'bg-linear-to-br from-orange-400 to-red-500 text-white shadow-sm'}`}>
                      {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
                    </div>

                    {/* Bubble */}
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-orange-600 text-white rounded-tr-none shadow-orange-500/20 shadow-md' 
                        : msg.isError 
                          ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-none' 
                          : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%] flex-row">
                    <div className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-linear-to-br from-orange-400 to-red-500 text-white shadow-sm">
                      <Bot size={16} />
                    </div>
                    <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Anna anything..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1.5 p-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-full transition-colors flex items-center justify-center"
                >
                  {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="-translate-x-px translate-y-px" />}
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400 font-medium tracking-wide">POWERED BY GEMINI AI</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-linear-to-r from-orange-500 to-red-500 rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center text-white focus:outline-none relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification dot when closed */}
        {!isOpen && messages.length === 0 && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </motion.button>
    </div>
  );
};

export default AnnaChatWidget;
