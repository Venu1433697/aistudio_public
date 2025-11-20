import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Loader2 } from 'lucide-react';
import { streamSupportResponse } from '../services/geminiService';
import * as d3 from 'd3'; // Used for unique ID generation if needed, mostly demonstrating lib usage requirement

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportChat: React.FC<SupportChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: 'Hi! I\'m ShopBot. Having trouble logging in?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: d3.randomLcg(Date.now())().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for context
    const history = messages.map(m => ({ role: m.role, text: m.text }));

    try {
      const stream = streamSupportResponse(history, userMsg.text);
      
      let botMsgId = d3.randomLcg(Date.now() + 1)().toString();
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '' }]);

      let accumulatedText = '';

      for await (const chunk of stream) {
        accumulatedText += chunk;
        setMessages(prev => 
          prev.map(m => m.id === botMsgId ? { ...m, text: accumulatedText } : m)
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 md:w-96 bg-[#353550] border border-gray-600 rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 animate-fade-in-up">
      {/* Header */}
      <div className="bg-[#2b2b40] p-4 flex justify-between items-center border-b border-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-os-primary/20 flex items-center justify-center text-os-primary">
            <MessageCircle size={18} />
          </div>
          <h3 className="font-semibold text-white">Support Chat</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-[#353550]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-os-secondary text-white rounded-br-none'
                  : 'bg-[#4a4a6a] text-gray-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-[#4a4a6a] p-3 rounded-lg rounded-bl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-os-primary" />
                </div>
            </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-[#2b2b40] border-t border-gray-600 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your issue..."
          className="flex-1 bg-[#353550] text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-os-primary border border-gray-600"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-os-primary text-[#2b2b40] p-2 rounded-md hover:bg-os-primaryHover disabled:opacity-50 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};