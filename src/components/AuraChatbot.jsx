import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'aura',
    text: "Hey! Kaise hain aap? Main Nitin Real Estate se Aura hu. Aaj kis tarah ki property dekh rahe hain?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const AuraChatbot = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Prepare optimized context window (last 6 messages max for ultra-fast payload)
    const historyPayload = updatedMessages.slice(-6).map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      sender: m.sender,
      text: m.text,
      parts: [{ text: m.text }]
    }));

    const auraMsgId = Date.now() + 1;
    let accumulatedText = '';
    let hasCreatedMsg = false;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: historyPayload,
          userName: user?.name || ''
        })
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      // Read SSE stream chunk by chunk for ultra-fast response (<200ms latency)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line chunk in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataContent = trimmed.replace('data: ', '').trim();
            if (dataContent === '[DONE]') {
              setIsTyping(false);
              break;
            }
            try {
              const parsed = JSON.parse(dataContent);
              if (parsed.text) {
                accumulatedText += parsed.text;
                if (!hasCreatedMsg) {
                  hasCreatedMsg = true;
                  setIsTyping(false);
                  setMessages(prev => [
                    ...prev,
                    {
                      id: auraMsgId,
                      sender: 'aura',
                      text: accumulatedText,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                } else {
                  setMessages(prev =>
                    prev.map(m => m.id === auraMsgId ? { ...m, text: accumulatedText } : m)
                  );
                }
              }
            } catch {
              // Ignore non-JSON SSE lines
            }
          }
        }
      }

      setIsTyping(false);
      return;

    } catch (err) {
      console.warn('Real-time SSE Chat Stream fallback:', err?.message);
      setIsTyping(false);

      if (!hasCreatedMsg) {
        const fallbackMsg = {
          id: Date.now() + 1,
          sender: 'aura',
          text: "Main aapki details note kar raha hu. Konsa area aur budget prefer karenge?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }
    }
  };

  return (
    <div className="aura-chatbot-root">
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="aura-toggle-btn shadow-lg"
        aria-label="Toggle Aura AI Chat"
      >
        <div className="position-relative d-flex align-items-center justify-content-center">
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'} fs-3 text-dark`}></i>
          {!isOpen && <span className="aura-online-indicator"></span>}
        </div>
      </motion.button>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="aura-chat-window glass-card shadow-2xl rounded-4 overflow-hidden"
          >
            {/* Header */}
            <div className="aura-chat-header p-3 d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-30 bg-dark bg-opacity-80">
              <div className="d-flex align-items-center gap-3">
                <div className="position-relative">
                  <div className="aura-avatar-circle bg-warning bg-opacity-20 border border-warning border-opacity-40 p-2 rounded-circle text-warning d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                    <i className="bi bi-person-fill fs-4"></i>
                  </div>
                  <span className="aura-online-indicator"></span>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="fw-bold text-gold-gradient fs-6">Aura — Nitin Real Estate</span>
                    <span className="badge bg-success text-dark fw-bold rounded-pill px-2 py-1 small" style={{ fontSize: '0.65rem' }}>Online</span>
                  </div>
                  <small className="text-slate-light d-block" style={{ fontSize: '0.75rem' }}>
                    Property Consultant • Ultra Fast Streaming
                  </small>
                </div>
              </div>
              <div className="d-flex align-items-center gap-1">
                <button
                  onClick={() => setMessages(INITIAL_MESSAGES)}
                  className="btn btn-sm btn-link text-slate-light hover-text-warning p-1"
                  title="Reset Conversation"
                >
                  <i className="bi bi-arrow-counterclockwise fs-5"></i>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn-sm btn-link text-slate-light hover-text-danger p-1"
                  title="Close Chat"
                >
                  <i className="bi bi-x-lg fs-5"></i>
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="aura-chat-body p-3 overflow-y-auto" style={{ maxHeight: '380px', minHeight: '280px' }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`d-flex flex-column mb-3 ${msg.sender === 'user' ? 'align-items-end' : 'align-items-start'}`}
                >
                  <div
                    className={`p-3 rounded-4 max-w-85 ${
                      msg.sender === 'user'
                        ? 'bg-warning text-dark fw-medium shadow-sm rounded-bottom-end-0'
                        : 'bg-dark bg-opacity-70 border border-secondary border-opacity-30 text-light rounded-bottom-start-0'
                    }`}
                    style={{ fontSize: '0.9rem', lineHeight: '1.5' }}
                  >
                    <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                  </div>
                  <span className="text-slate-light mt-1 px-1" style={{ fontSize: '0.68rem' }}>
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="bg-dark bg-opacity-70 border border-secondary border-opacity-30 p-2 px-3 rounded-4 text-warning small d-flex align-items-center gap-2">
                    <span className="spinner-grow spinner-grow-sm text-warning" role="status"></span>
                    <span>Aura is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="aura-chat-footer p-2 p-sm-3 border-top border-secondary border-opacity-30 bg-dark bg-opacity-90">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="d-flex align-items-center gap-2"
              >
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary shadow-none rounded-pill px-3 py-2"
                  placeholder="Type a message (e.g., 2 BHK in Noida under 50L)..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  style={{ fontSize: '0.88rem' }}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="btn btn-warning rounded-circle p-2 d-flex align-items-center justify-content-center text-dark flex-shrink-0"
                  style={{ width: '40px', height: '40px' }}
                >
                  <i className="bi bi-send-fill fs-6"></i>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuraChatbot;
