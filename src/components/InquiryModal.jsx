import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modalVariant = {
  hidden: { opacity: 0, y: "-50%", x: "-50%", scale: 0.9 },
  show: { opacity: 1, y: "-50%", x: "-50%", scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
};

const InquiryModal = ({ isOpen, onClose, property, buyer, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: buyer?.name || '',
    phone: '',
    message: property ? `Hello Nitin Real Estate, I am interested in buying the property ${property.title} located at ${property.location} for $${property.price}.` : ''
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="modal-backdrop fade show" onClick={onClose} style={{ zIndex: 1050 }}></div>
          <motion.div
            variants={modalVariant}
            initial="hidden"
            animate="show"
            exit="exit"
            className="modal d-block"
            tabIndex="-1"
            style={{ position: 'fixed', top: '50%', left: '50%', width: '100%', maxWidth: '500px', height: 'auto', transform: 'translate(-50%, -50%)', zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered w-100 m-0">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 bg-light rounded-top-4">
                  <h5 className="modal-title fw-bold" style={{color: 'var(--primary-color)'}}>Inquire About Property</h5>
                  <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <div className="modal-body p-4">
                  <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Name</label>
                      <input type="text" className="form-control" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Phone Number</label>
                      <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Message</label>
                      <textarea className="form-control" name="message" rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      className="btn w-100 py-3 premium-btn"
                    >
                      <i className="bi bi-whatsapp me-2"></i>Send via WhatsApp
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InquiryModal;
