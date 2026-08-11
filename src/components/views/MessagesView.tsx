import React, { useState, useEffect } from 'react';
import { Send, Image, Phone, Video, Info, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { Conversation, Message, User } from '../../types';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';

export const MessagesView: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await api.getConversations();
        setConversations(res.conversations);
        if (res.conversations.length > 0) {
          setSelectedConv(res.conversations[0]);
        }
      } catch (err) {
        console.error('Messages load error:', err);
      }
    }
    loadConversations();
  }, []);

  useEffect(() => {
    if (!selectedConv) return;
    async function loadMsg() {
      setIsLoadingMessages(true);
      try {
        const res = await api.getMessages(selectedConv.id);
        setMessages(res.messages);
      } catch (err) {
        console.error('Error loading messages:', err);
      } finally {
        setIsLoadingMessages(false);
      }
    }
    loadMsg();
  }, [selectedConv]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedConv) return;
    const text = input.trim();
    setInput('');

    try {
      const res = await api.sendMessage(selectedConv.id, text);
      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
      }
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const partner: User | undefined = selectedConv?.participants.find((p) => p.id !== user?.id);

  return (
    <div className="max-w-5xl mx-auto h-[82vh] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden flex">
      {/* Left Conversations Sidebar */}
      <div className="w-full sm:w-80 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Messages</h2>
          <span className="text-xs text-amber-500 font-mono">Amira Direct</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
          {conversations.map((conv) => {
            const convPartner = conv.participants.find((p) => p.id !== user?.id) || conv.participants[0];
            const isSelected = selectedConv?.id === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-amber-500/10 border-l-4 border-amber-500'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Avatar src={convPartner.avatarUrl} size="md" isVerified={convPartner.isVerified} />
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {convPartner.displayName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">12m</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {conv.lastMessage?.content || 'Started conversation'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Stream */}
      {selectedConv && partner ? (
        <div className="hidden sm:flex flex-1 flex-col h-full bg-slate-50/50 dark:bg-slate-950/50">
          {/* Active Header */}
          <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={partner.avatarUrl} size="sm" isVerified={partner.isVerified} />
              <div>
                <span className="block text-sm font-bold text-slate-900 dark:text-white">
                  {partner.displayName}
                </span>
                <span className="block text-[10px] text-emerald-500 font-medium">Online on Amira</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <button className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <Video className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {isLoadingMessages ? (
              <div className="text-center py-8 text-xs text-slate-400">Loading messages...</div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Footer Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${partner.displayName}...`}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40 shadow-md shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center p-8 text-center text-slate-400 text-sm">
          Select a message thread to begin chatting.
        </div>
      )}
    </div>
  );
};
