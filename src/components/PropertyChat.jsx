import { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import './PropertyChat.css';

// Socket connection
let socket;

const PropertyChat = ({ property, onClose }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const buyer_id = user?.role === 'Buyer' ? user._id : null;
  // If the current user is the seller, they'll see multiple buyers ideally, but for now we'll do 1-on-1 where the room is always based on the logged-in buyer.
  // Realistically, the seller needs a dashboard to view all chats. This is a simplified 1-on-1 for the property page.
  const room_seller_id = property.user_id?._id || property.user_id;

  useEffect(() => {
    // Only connect if the user is a buyer, or if we handle seller incoming chats
    if (!user) return;

    socket = io('http://localhost:5000'); // Assuming backend is on 5000

    // Join room
    socket.emit('join_room', {
      property_id: property._id,
      buyer_id: user._id, // Assume current user is buyer for this context
      seller_id: room_seller_id
    });

    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [property, user, room_seller_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageData = {
      property_id: property._id,
      buyer_id: user._id,
      seller_id: room_seller_id,
      sender_id: user._id,
      receiver_id: room_seller_id, // If seller is replying, receiver is buyer. This requires slightly more logic if seller replies.
      content: newMessage,
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="property-chat-modal glass-card shadow-2xl rounded-4 overflow-hidden"
      >
        <div className="chat-header bg-gradient-dark text-white p-3 d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-0 fw-bold"><i className="bi bi-chat-dots-fill text-warning me-2"></i>Chat with Seller</h6>
            <small className="text-white-50">{property.title}</small>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-outline-light rounded-circle"><i className="bi bi-x-lg"></i></button>
        </div>
        
        <div className="chat-body p-3 bg-light overflow-auto" style={{ height: '300px' }}>
          {messages.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <i className="bi bi-shield-lock display-4 opacity-25"></i>
              <p className="mt-2 small">Your number is hidden.<br/>Start a secure chat with the seller.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 d-flex ${msg.sender_id === user._id ? 'justify-content-end' : 'justify-content-start'}`}>
                <div className={`p-2 px-3 rounded-4 shadow-sm ${msg.sender_id === user._id ? 'bg-primary text-white' : 'bg-white border'}`} style={{ maxWidth: '80%' }}>
                  <p className="mb-0 small">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-footer p-3 bg-white border-top">
          <form onSubmit={handleSendMessage} className="d-flex gap-2">
            <input 
              type="text" 
              className="form-control rounded-pill bg-light" 
              placeholder="Type your message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="btn btn-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-send-fill text-dark"></i>
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PropertyChat;
