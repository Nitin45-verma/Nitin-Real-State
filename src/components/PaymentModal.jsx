import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modalVariant = {
  hidden: { opacity: 0, y: "-50%", x: "-50%", scale: 0.9 },
  show: { opacity: 1, y: "-50%", x: "-50%", scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const PaymentModal = ({ isOpen, onClose, property, onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !property) return null;

  const simulatePayment = async (status) => {
    setLoading(true);
    await onPaymentComplete(status);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="modal-backdrop fade show" onClick={onClose} style={{ zIndex: 1060 }}></div>
          <motion.div
            variants={modalVariant}
            initial="hidden"
            animate="show"
            exit="exit"
            className="modal d-block"
            tabIndex="-1"
            style={{ position: 'fixed', top: '50%', left: '50%', width: '100%', maxWidth: '400px', height: 'auto', transform: 'translate(-50%, -50%)', zIndex: 1065 }}
          >
            <div className="modal-dialog modal-dialog-centered w-100 m-0">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                 <div className="bg-dark text-white p-4 text-center">
                   <h4 className="fw-bold mb-1">Pay Token Amount</h4>
                   <p className="mb-0 text-muted small">Reserve {property.title}</p>
                 </div>
                 <div className="p-4 text-center bg-light">
                    <h2 className="display-5 fw-bold text-success mb-4">$50,000</h2>
                    <p className="text-muted small mb-4">Please note that this is a simulated payment gateway. Clicking "Approve" will verify the payment on the server securely.</p>
                    <div className="d-flex flex-column gap-3">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        onClick={() => simulatePayment('Success')}
                        className="btn btn-success py-2 fw-bold w-100"
                      >
                        {loading ? 'Processing...' : 'Approve Test Payment'}
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        onClick={() => simulatePayment('Failed')}
                        className="btn btn-outline-danger py-2 w-100"
                      >
                        Decline Payment
                      </motion.button>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
