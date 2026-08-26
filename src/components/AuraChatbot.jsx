import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'aura',
    text: "👋 Hi! I'm **Aura**, your senior AI Real Estate Assistant at **Nitin Real Estate**.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 2,
    sender: 'aura',
    text: "How can I assist you today? You can search properties by budget & location, or book an on-site viewing!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    quickOptions: [
      "🔍 3-BHK flats under 50 Lakhs",
      "🏰 Luxury Villas in Noida",
      "🔑 Sell my property",
      "📅 Book a property tour"
    ]
  }
];

const AuraChatbot = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bookingStep, setBookingStep] = useState(null); // null | 'select_prop' | 'collect_info'
  const [bookingData, setBookingData] = useState({ name: '', phone: '', preferredDate: '', propTitle: '' });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Handle bot intelligent response calculation with strict Dynamic Language Mirroring
  const generateAuraResponse = (userText) => {
    const text = userText.toLowerCase();

    // 1. Language Detection Helper
    const isHindiScript = /[\u0900-\u097F]/.test(userText); // Pure Devanagari Hindi
    const isHinglish = /mujhe|chahiye|batao|bechna|dekhna|kaise|hisaab|hai|mein|kya|dikhayein|sir|bhai|flats|kitne|under|lakh|crore|dekhni|book|karna|hoga|ke|par/.test(text);

    // 2. Intent Detection
    const isBooking = text.includes('book') || text.includes('tour') || text.includes('viewing') || text.includes('visit') || text.includes('dekhna') || text.includes('विजिट') || text.includes('बुक');
    const is3BHK = text.includes('3-bhk') || text.includes('3bhk') || text.includes('50 lakh') || text.includes('50l') || text.includes('50 लाख') || text.includes('flat');
    const isVilla = text.includes('villa') || text.includes('luxury') || text.includes('house') || text.includes('विला');
    const isSell = text.includes('sell') || text.includes('list') || text.includes('my property') || text.includes('bechna') || text.includes('बेचना') || text.includes('लिस्ट');
    const isLegal = text.includes('legal') || text.includes('tax') || text.includes('deed') || text.includes('document') || text.includes('कागजात');

    // === HINDI SCRIPT (Devanagari) RESPONSES ===
    if (isHindiScript) {
      if (isBooking) {
        return {
          text: "मैं आपकी प्राइवेट प्रॉपर्टी विजिट बुक करने में मदद कर सकती हूँ! 📅\n\nकृपया अपना पसंदीदा **दिन/समय** और **फ़ोन नंबर** साझा करें, हमारे सीनियर एजेंट 15 मिनट में आपसे संपर्क करके अपॉइंटमेंट कंफर्म करेंगे।",
          quickOptions: ["कल शाम 4 बजे", "इस वीकेंड (शनिवार 11 बजे)", "एजेंट से सीधा संपर्क करें"]
        };
      }
      if (is3BHK) {
        return {
          text: "आपके **₹50 लाख के बजट** में सबसे बेहतरीन **3-BHK फ्लैट्स** उपलब्ध हैं:\n\n• **सनराइज रेजीडेंसी (Ref #SR-302)** — **₹45.5 लाख** | 3 BHK, 2 बाथ | सेक्टर 62, नोएडा\n  - कवर पार्किंग, 2 बालकनी, मॉड्यूलर किचन, 24/7 सुरक्षा।\n\n• **ग्रीन वैली हाइट्स (Ref #GV-108)** — **₹48.0 लाख** | 3 BHK, 3 बाथ | ग्रेटर नोएडा वेस्ट\n  - गेटेड सोसाइटी, क्लब हाउस, पूल एक्सेस, मेट्रो पास।\n\nक्या आप इसके लिए साइट विजिट बुक करना चाहेंगे या फ्लोर प्लान देखना चाहते हैं?",
          quickOptions: ["📅 सनराइज रेजीडेंसी की विजिट बुक करें", "📅 ग्रीन वैली की विजिट बुक करें", "2-BHK विकल्प दिखाएं"]
        };
      }
      if (isVilla) {
        return {
          text: "यहाँ प्राइम सेक्टर्स में उपलब्ध **लक्जरी विला** लिस्टिंग हैं:\n\n• **इम्पीरियल गोल्फ एस्टेट (Ref #IGE-901)** — **₹3.20 करोड़** | 5 BHK विला | सेक्टर 128, नोएडा\n  - प्राइवेट पूल, गार्डन, 3-कार गैराज, स्मार्ट होम।\n\n• **रॉयल पाल्म्स विला (Ref #RP-405)** — **₹1.85 करोड़** | 4 BHK डुप्लेक्स | यमुना एक्सप्रेसवे\n  - कॉर्नर प्लॉट, टेरेस गार्डन, डबल-हाइट सीलिंग।\n\nक्या आप प्राइवेट साइट विजिट शेड्यूल करना चाहते हैं?",
          quickOptions: ["📅 विला विजिट बुक करें", "लोकेशन डिटेल्स पूछें"]
        };
      }
      if (isSell) {
        return {
          text: "**नितिन रियल एस्टेट** पर अपनी संपत्ति लिस्ट करना बेहद आसान है! 🔑\n\nहम आपकी लिस्टिंग को सत्यापित खरीदारों से जोड़ते हैं। आप हमारे **Sell** पेज पर विवरण जमा कर सकते हैं या एजेंट कॉल बैक के लिए अपना फोन नंबर साझा कर सकते हैं।",
          quickOptions: ["Sell पेज पर जाएं", "एजेंट कॉल बैक रिक्वेस्ट करें"]
        };
      }
      if (isLegal) {
        return {
          text: "जबकि मैं बाजार का सही अनुमान प्रदान कर सकती हूँ, हमारे लाइसेंस प्राप्त प्रॉपर्टी वकील और सीनियर एजेंट आपके साथ सटीक टैक्स, रजिस्ट्री और डीड विवरण की समीक्षा कर सकते हैं।",
          quickOptions: ["लीगल टीम से जुड़ें", "सपोर्ट पर कॉल करें"]
        };
      }
      return {
        text: "नितिन रियल एस्टेट में आपका स्वागत है! परफेक्ट प्रॉपर्टी ढूंढने के लिए कृपया बताएं:\n\n1. **पसंदीदा लोकेशन** (उदा. नोएडा, ग्रेटर नोएडा, दिल्ली NCR)\n2. **प्रॉपर्टी का प्रकार** (फ्लैट, विला, प्लॉट)\n3. **अनुमानित बजट सीमा**",
        quickOptions: ["₹50 लाख से कम", "₹50 लाख - ₹1.5 करोड़", "₹1.5 करोड़ से अधिक"]
      };
    }

    // === HINGLISH (Roman Hindi) RESPONSES ===
    if (isHinglish) {
      if (isBooking) {
        return {
          text: "Main aapki private viewing book karne me help kar sakti hu! 📅\n\nKripya apna preferred **Day/Time** aur **Phone Number** share karein, hamare senior agent 15 minute me confirm karenge.",
          quickOptions: ["Kal Shaam 4 PM", "Is Weekend (Sat 11 AM)", "Agent se direct connect karein"]
        };
      }
      if (is3BHK) {
        return {
          text: "Aapke budget **₹50 Lakhs ke under** ye top verified **3-BHK flats** available hain:\n\n• **Sunrise Residency (Ref #SR-302)** — **₹45.5 Lakhs** | 3 BHK, 2 Baths | Sector 62, Noida\n  - Covered parking, 2 balconies, modular kitchen, 24/7 security.\n\n• **Green Valley Heights (Ref #GV-108)** — **₹48.0 Lakhs** | 3 BHK, 3 Baths | Greater Noida West\n  - Gated society, clubhouse access, metro near.\n\nKya aap inka site visit book karna chahenge ya full floor plan dekhna chahenge?",
          quickOptions: ["📅 Sunrise Residency visit book karein", "📅 Green Valley visit book karein", "2-BHK options dikhayein"]
        };
      }
      if (isVilla) {
        return {
          text: "Ye rahe top prime locations ke **Luxury Villa listings**:\n\n• **Imperial Golf Estate (Ref #IGE-901)** — **₹3.20 Cr** | 5 BHK Villa | Sector 128, Noida\n  - Private pool, lawn, 3-car garage, smart home.\n\n• **Royal Palms Villa (Ref #RP-405)** — **₹1.85 Cr** | 4 BHK Duplex | Yamuna Expressway\n  - Corner plot, terrace garden.\n\nKya aap private walkthrough tour schedule karna chahenge?",
          quickOptions: ["📅 Villa Tour Book Karein", "Location details puchein"]
        };
      }
      if (isSell) {
        return {
          text: "**Nitin Real Estate** par apna property list karna bahut aasan hai! 🔑\n\nHum aapki listing ko verified buyers se connect karte hain. Aap hamare **Sell** page par details submit kar sakte hain ya apna number share karein agent callback ke liye.",
          quickOptions: ["Sell Page Par Jayein", "Request Agent Callback"]
        };
      }
      if (isLegal) {
        return {
          text: "Main standard market estimates bata sakti hu, lekin exact tax, registry aur deed documents hamare licensed property attorneys aur senior agents aapke saath review karenge.",
          quickOptions: ["Legal Team Se Connect Karein", "Support Direct Call"]
        };
      }
      return {
        text: "Main aapke budget ke hisaab se best flats dikha sakti hu! Perfect property dhoondhne ke liye kripya share karein:\n\n1. **Preferred Location** (e.g., Noida, Greater Noida, Delhi NCR)\n2. **Property Type** (Apartment, Villa, Plot)\n3. **Approximate Budget Range**",
        quickOptions: ["Under ₹50 Lakhs", "₹50 Lakhs - ₹1.5 Cr", "Above ₹1.5 Cr"]
      };
    }

    // === ENGLISH RESPONSES ===
    if (isBooking) {
      return {
        text: "I would be happy to schedule a private viewing for you! 📅\n\nPlease let me know your preferred **Day/Time** and your **Phone Number**, and our senior agent will confirm your appointment within 15 minutes.",
        quickOptions: ["Tomorrow at 4 PM", "This Weekend (Sat 11 AM)", "Connect with Agent directly"]
      };
    }
    if (is3BHK) {
      return {
        text: "Here are top verified **3-BHK flats under ₹50 Lakhs** available right now:\n\n• **Sunrise Residency (Ref #SR-302)** — **₹45.5 Lakhs** | 3 BHK, 2 Baths | Sector 62, Noida\n  - Covered parking, 2 balconies, modular kitchen, 24/7 security.\n\n• **Green Valley Heights (Ref #GV-108)** — **₹48.0 Lakhs** | 3 BHK, 3 Baths | Greater Noida West\n  - Gated society, clubhouse, pool access, near metro.\n\nWould you like full photos and floor plans, or to book an on-site visit?",
        quickOptions: ["📅 Book viewing for Sunrise Residency", "📅 Book viewing for Green Valley", "Show 2-BHK options instead"]
      };
    }
    if (isVilla) {
      return {
        text: "Here are featured **Luxury Villa listings** in top prime sectors:\n\n• **Imperial Golf Estate (Ref #IGE-901)** — **₹3.20 Cr** | 5 BHK Villa | Sector 128, Noida\n  - Private pool, landscaped lawn, 3-car garage, smart home automation.\n\n• **Royal Palms Villa (Ref #RP-405)** — **₹1.85 Cr** | 4 BHK Duplex | Yamuna Expressway\n  - Corner plot, terrace garden, double-height ceiling.\n\nWould you like to schedule a private walkthrough tour?",
        quickOptions: ["📅 Book Villa Walkthrough", "Ask for location details"]
      };
    }
    if (isSell) {
      return {
        text: "Listing your property with **Nitin Real Estate** is fast & easy! 🔑\n\nWe connect your listing with verified buyers, manage inquiries, and ensure hassle-free closing. You can submit your property details directly on our **Sell** page or leave your phone number here for an immediate agent callback.",
        quickOptions: ["Go to Sell Page", "Request Agent Callback"]
      };
    }
    if (isLegal) {
      return {
        text: "While I can provide standard market estimates, our licensed property attorneys and senior legal advisors can review exact tax, deed, and registration details with you.",
        quickOptions: ["Connect with Legal Team", "Call Support Direct"]
      };
    }

    return {
      text: "Thank you for reaching out! To help me find the perfect property match for you, could you share:\n\n1. **Preferred Location** (e.g., Noida, Greater Noida, Delhi NCR)\n2. **Property Type** (Apartment, Villa, Plot)\n3. **Approximate Budget Range**",
      quickOptions: ["Under ₹50 Lakhs", "₹50 Lakhs - ₹1.5 Cr", "Above ₹1.5 Cr"]
    };
  };

  const handleSendMessage = (textToSend) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate Aura thinking & typing
    setTimeout(() => {
      const response = generateAuraResponse(messageText);
      const auraMsg = {
        id: Date.now() + 1,
        sender: 'aura',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickOptions: response.quickOptions
      };
      setMessages(prev => [...prev, auraMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickOptionClick = (option) => {
    handleSendMessage(option);
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
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-robot'} fs-4 text-dark`}></i>
          {!isOpen && <span className="aura-online-indicator"></span>}
        </div>
        {!isOpen && (
          <span className="aura-badge-label ms-2 d-none d-sm-inline-block fw-bold">
            Chat with Aura AI
          </span>
        )}
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
                    <i className="bi bi-robot fs-4"></i>
                  </div>
                  <span className="aura-online-indicator"></span>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="fw-bold text-gold-gradient fs-6">Aura AI Assistant</span>
                    <span className="badge bg-warning text-dark fw-bold rounded-pill px-2 py-1 small" style={{ fontSize: '0.65rem' }}>AI Senior Agent</span>
                  </div>
                  <small className="text-slate-light d-block" style={{ fontSize: '0.75rem' }}>
                    Nitin Real Estate • Online 24/7
                  </small>
                </div>
              </div>
              <div className="d-flex align-items-center gap-1">
                <button
                  onClick={() => setMessages(INITIAL_MESSAGES)}
                  className="btn btn-sm btn-link text-slate-light hover-text-warning p-1"
                  title="Clear Chat"
                >
                  <i className="bi bi-arrow-counterclockwise fs-5"></i>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn-sm btn-link text-slate-light hover-text-danger p-1"
                  title="Minimize Chat"
                >
                  <i className="bi bi-x-lg fs-5"></i>
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="aura-chat-body p-3 overflow-y-auto">
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
                    <div style={{ whiteSpace: 'pre-line' }}>
                      {msg.text.split('**').map((part, i) =>
                        i % 2 === 1 ? <strong key={i} className={msg.sender === 'aura' ? 'text-warning' : 'fw-bold'}>{part}</strong> : part
                      )}
                    </div>
                  </div>
                  <span className="text-slate-light mt-1 px-1" style={{ fontSize: '0.68rem' }}>
                    {msg.timestamp}
                  </span>

                  {/* Quick Pills */}
                  {msg.quickOptions && msg.quickOptions.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-2 max-w-90">
                      {msg.quickOptions.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickOptionClick(opt)}
                          className="btn btn-outline-warning btn-sm rounded-pill px-3 py-1 text-start"
                          style={{ fontSize: '0.78rem', background: 'rgba(212, 175, 55, 0.05)' }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="bg-dark bg-opacity-70 border border-secondary border-opacity-30 p-2 px-3 rounded-4 text-warning small d-flex align-items-center gap-2">
                    <span className="spinner-grow spinner-grow-sm text-warning" role="status"></span>
                    <span>Aura is typing response...</span>
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
                  placeholder="Ask Aura about budget, locations, flats..."
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
