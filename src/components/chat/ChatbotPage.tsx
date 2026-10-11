import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Paperclip,
  X,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { ChatMessage, ChatConversation, ActivityItem, PageId } from '../../types';

interface ChatbotPageProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  onLogActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  onSaveAnswer: (title: string, content: string) => void;
  savedAnswerIds: Set<string>;
  onNavigate: (page: PageId) => void;
}

export const ChatbotPage: React.FC<ChatbotPageProps> = ({
  initialPrompt,
  onClearInitialPrompt,
  onLogActivity,
  onSaveAnswer,
  savedAnswerIds,
  onNavigate,
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem('bioassist_chat_conversations');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'default',
        title: 'New Biotechnology Inquiry',
        createdAt: new Date().toLocaleDateString(),
        messages: [],
      },
    ];
  });

  const [activeConvId, setActiveConvId] = useState<string>('default');
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [backendMode, setBackendMode] = useState<'live' | 'demo' | 'checking'>('checking');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down'>>({});
  const [showProtocolModal, setShowProtocolModal] = useState<boolean>(false);
  const [protocolInputText, setProtocolInputText] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check server health & model availability
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setBackendMode(data.liveModelAvailable ? 'live' : 'demo');
      })
      .catch(() => {
        setBackendMode('demo');
      });
  }, []);

  // Persist conversations
  useEffect(() => {
    try {
      localStorage.setItem('bioassist_chat_conversations', JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isLoading]);

  // Handle incoming initial prompt if passed from another screen
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      sendMessage(initialPrompt.trim());
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const promptChips = [
    'Explain CRISPR-Cas9 in simple terms.',
    'Help me calculate a molar solution.',
    'What is the difference between PCR and qPCR?',
    'Explain oncogenes and tumor suppressor genes.',
    'Help me understand a molecular biology protocol.',
    'What are common sources of PCR contamination?',
  ];

  const handleCreateNewConversation = () => {
    const newConv: ChatConversation = {
      id: `conv_${Date.now()}`,
      title: `Conversation ${conversations.length + 1}`,
      createdAt: new Date().toLocaleDateString(),
      messages: [],
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
  };

  const handleClearHistory = () => {
    if (confirm('Clear all conversation history?')) {
      const resetConv: ChatConversation = {
        id: 'default',
        title: 'New Biotechnology Inquiry',
        createdAt: new Date().toLocaleDateString(),
        messages: [],
      };
      setConversations([resetConv]);
      setActiveConvId('default');
    }
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update conversation with user message
    const updatedMessages = [...(activeConversation?.messages || []), userMsg];
    const updatedConversations = conversations.map((c) => {
      if (c.id === activeConvId) {
        return {
          ...c,
          title: c.messages.length === 0 ? textToSend.slice(0, 30) + '...' : c.title,
          messages: updatedMessages,
        };
      }
      return c;
    });

    setConversations(updatedConversations);
    setInputText('');
    setIsLoading(true);

    onLogActivity({
      type: 'chat',
      title: 'Asked BioAssist AI',
      description: textToSend.slice(0, 50) + (textToSend.length > 50 ? '...' : ''),
      linkPage: 'chat',
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const assistantReply = data.reply || 'No response generated.';

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now()}_a`,
        role: 'assistant',
        content: assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: data.mode === 'live' ? 'live' : 'demo',
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: [...c.messages, assistantMsg],
            };
          }
          return c;
        })
      );
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(
        err.message || 'Unable to connect to BioAssist AI service. Please verify your network.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleAttachProtocol = () => {
    if (!protocolInputText.trim()) return;
    const prompt = `Please review and explain the scientific purpose and critical steps of this laboratory protocol:\n\n${protocolInputText.trim()}`;
    setShowProtocolModal(false);
    setProtocolInputText('');
    sendMessage(prompt);
  };

  return (
    <div className="max-w-7xl mx-auto pb-10 h-[calc(100vh-6.5rem)] flex flex-col md:flex-row gap-4">
      {/* ======================================================== */}
      {/* LEFT PANEL: CONVERSATION HISTORY */}
      {/* ======================================================== */}
      <div className="w-full md:w-64 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-4 shadow-xs flex flex-col justify-between hidden md:flex">
        <div className="space-y-3">
          <button
            onClick={handleCreateNewConversation}
            className="w-full py-2 px-3 rounded-xl bg-[#16A6A1] hover:bg-[#118480] text-white text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Conversation</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-[#68778A] font-semibold pt-1">
            <span>Recent Chats</span>
            <span>{conversations.length}</span>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[55vh]">
            {conversations.map((c) => {
              const isActive = c.id === activeConvId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between group ${
                    isActive
                      ? 'bg-[#12304A] text-white dark:bg-[#16A6A1]'
                      : 'hover:bg-slate-50 dark:hover:bg-[#16273B] text-[#243447] dark:text-slate-300'
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <BotMessageSquare
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isActive ? 'text-[#B8F2D0]' : 'text-[#16A6A1]'
                      }`}
                    />
                    <span className="truncate font-medium">{c.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear control */}
        <div className="pt-3 border-t border-[#E1E8EF] dark:border-[#1E344D]">
          <button
            onClick={handleClearHistory}
            className="w-full py-1.5 text-[11px] text-[#68778A] hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat History</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN CHAT AREA */}
      {/* ======================================================== */}
      <div className="flex-1 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl shadow-xs flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#E1E8EF] dark:border-[#1E344D] flex items-center justify-between bg-[#FAFCFD] dark:bg-[#0E1A27]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#16A6A1] text-white flex items-center justify-center shadow-xs">
              <BotMessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#12304A] dark:text-white">
                  BioAssist AI
                </h3>
                {backendMode === 'live' ? (
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Live Model (Gemini 3.8 Flash)
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Educational Biotech Mode
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8]">
                Ask questions. Understand mechanisms. Learn laboratory science.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowProtocolModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-[#12304A] dark:text-white bg-white dark:bg-[#1A2E44] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Paperclip className="w-3.5 h-3.5 text-[#16A6A1]" />
            <span>Paste Protocol</span>
          </button>
        </div>

        {/* Message Container */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-5">
          {/* Welcome Message if chat is empty */}
          {(!activeConversation?.messages || activeConversation.messages.length === 0) && (
            <div className="space-y-5 py-4 max-w-2xl mx-auto">
              <div className="p-5 rounded-2xl bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#16A6A1]" />
                  <span className="text-xs font-bold text-[#12304A] dark:text-white">
                    Welcome to BioAssist AI
                  </span>
                </div>
                <p className="text-xs text-[#243447] dark:text-slate-300 leading-relaxed">
                  Hello! I’m BioAssist AI, your biotechnology learning assistant. I can help you understand molecular biology concepts, review laboratory calculations, explore CRISPR technology, and learn the scientific principles behind common experimental methods. What would you like to explore today?
                </p>
              </div>

              {/* Suggested Prompt Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-[#68778A] block">
                  Suggested inquiries to get started:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {promptChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(chip)}
                      className="p-2.5 rounded-xl text-left text-xs bg-white dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] hover:border-[#16A6A1] dark:hover:border-[#16A6A1] text-[#243447] dark:text-slate-200 hover:text-[#16A6A1] transition-all flex items-center justify-between shadow-2xs"
                    >
                      <span className="truncate">{chip}</span>
                      <ExternalLink className="w-3 h-3 text-[#16A6A1] flex-shrink-0 ml-1.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active messages list */}
          {activeConversation?.messages?.map((msg) => {
            const isUser = msg.role === 'user';
            const isSaved = savedAnswerIds.has(msg.id);

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#16A6A1] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BotMessageSquare className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs space-y-2 ${
                    isUser
                      ? 'bg-[#12304A] text-white rounded-tr-xs'
                      : 'bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] text-[#243447] dark:text-slate-200 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  {/* Message content rendering */}
                  <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                    {msg.content}
                  </div>

                  {/* Assistant response toolbar */}
                  {!isUser && (
                    <div className="pt-2 mt-2 border-t border-[#E1E8EF] dark:border-[#1E344D] flex items-center justify-between text-[11px] text-[#68778A]">
                      <span className="text-[10px]">{msg.timestamp}</span>

                      <div className="flex items-center gap-2">
                        {/* Copy button */}
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          title="Copy Answer"
                          className="p-1 hover:text-[#12304A] dark:hover:text-white transition-colors"
                        >
                          {copiedMsgId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Save to reference library button */}
                        <button
                          onClick={() => onSaveAnswer(`AI Answer: ${msg.content.slice(0, 30)}...`, msg.content)}
                          title="Save to Saved References"
                          className="p-1 hover:text-[#16A6A1] transition-colors"
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-3.5 h-3.5 text-[#16A6A1]" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Feedback thumbs */}
                        <button
                          onClick={() =>
                            setFeedbackState({ ...feedbackState, [msg.id]: 'up' })
                          }
                          title="Helpful"
                          className={`p-1 hover:text-emerald-600 ${
                            feedbackState[msg.id] === 'up' ? 'text-emerald-600 font-bold' : ''
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setFeedbackState({ ...feedbackState, [msg.id]: 'down' })
                          }
                          title="Needs improvement"
                          className={`p-1 hover:text-rose-600 ${
                            feedbackState[msg.id] === 'down' ? 'text-rose-600 font-bold' : ''
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-[#68778A]">
              <div className="w-7 h-7 rounded-lg bg-[#16A6A1] text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                <BotMessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D]">
                <div className="w-2 h-2 rounded-full bg-[#16A6A1] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#16A6A1] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#16A6A1] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-medium text-[#16A6A1]">
                  BioAssist AI is reasoning...
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Request Failed</p>
                <p className="text-[11px] mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="p-3 md:p-4 border-t border-[#E1E8EF] dark:border-[#1E344D] bg-[#FAFCFD] dark:bg-[#0E1A27]">
          <div className="relative rounded-2xl border border-[#E1E8EF] dark:border-[#1E344D] bg-white dark:bg-[#112234] focus-within:ring-2 focus-within:ring-[#16A6A1]/40 transition-all p-2 flex flex-col gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask BioAssist AI a biotechnology question, formula check, or protocol guidance..."
              rows={2}
              className="w-full bg-transparent resize-none text-xs text-[#243447] dark:text-white placeholder-[#68778A] focus:outline-none px-2"
            />

            <div className="flex items-center justify-between px-2 pt-1 border-t border-slate-100 dark:border-[#1E344D]/50 text-[11px] text-[#68778A]">
              <span className="hidden sm:inline text-[10px]">
                Press <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono">Shift+Enter</kbd> for newline
              </span>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={!inputText.trim() || isLoading}
                  className="px-3 py-1.5 rounded-xl bg-[#16A6A1] hover:bg-[#118480] disabled:opacity-40 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PROTOCOL PASTE MODAL */}
      {/* ======================================================== */}
      {showProtocolModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8EF] dark:border-[#1E344D]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#16A6A1]" />
                <h3 className="text-sm font-bold text-[#12304A] dark:text-white">
                  Paste Laboratory Protocol for AI Analysis
                </h3>
              </div>
              <button
                onClick={() => setShowProtocolModal(false)}
                className="text-[#68778A] hover:text-[#12304A] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#68778A]">
              Paste an excerpt of a molecular biology SOP or assay protocol (e.g. plasmid miniprep, PCR thermocycling, or transfection steps) for structured scientific explanation.
            </p>

            <textarea
              value={protocolInputText}
              onChange={(e) => setProtocolInputText(e.target.value)}
              placeholder="e.g. 1. Add 250 µL Buffer P1 and resuspend pellet. 2. Add 250 µL Buffer P2 and invert 4-6 times..."
              rows={6}
              className="w-full p-3 bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40 font-mono"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowProtocolModal(false)}
                className="px-3 py-1.5 rounded-xl border border-[#E1E8EF] dark:border-[#1E344D] text-xs font-semibold text-[#68778A]"
              >
                Cancel
              </button>
              <button
                onClick={handleAttachProtocol}
                disabled={!protocolInputText.trim()}
                className="px-4 py-1.5 rounded-xl bg-[#16A6A1] hover:bg-[#118480] disabled:opacity-40 text-white text-xs font-semibold"
              >
                Analyze Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
