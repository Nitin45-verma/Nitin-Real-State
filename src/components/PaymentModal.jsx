import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const modalVariant = {
  hidden: { opacity: 0, y: "-50%", x: "-50%", scale: 0.9 },
  show: { opacity: 1, y: "-50%", x: "-50%", scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentModal = ({ isOpen, onClose, property, user, onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !property) return null;

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const storedToken = localStorage.getItem('token');
      const config = storedToken ? { headers: { Authorization: `Bearer ${storedToken}` } } : {};

      // Call backend to create Razorpay Order
      const { data } = await axios.post('/api/payment/create-order', {
        property_id: property._id,
        amount: 50000
      }, config);

      if (!data || !data.order_id) {
        alert("Failed to initiate order with Razorpay.");
        setLoading(false);
        return;
      }

      const options = {
        key: data.key_id || 'rzp_test_TR8Mdnq5rde0vO',
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'Nitin Real Estate',
        description: `Token Amount for ${property.title}`,
        order_id: data.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              transactionId: data.transactionId
            }, config);

            if (verifyRes.data && verifyRes.data.success) {
              alert(`🎉 Token Payment Successful!\nOrder ID: ${response.razorpay_order_id}`);
              if (onPaymentComplete) onPaymentComplete('Success');
            } else {
              alert('Payment signature verification failed.');
              if (onPaymentComplete) onPaymentComplete('Failed');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Payment verification error.');
            if (onPaymentComplete) onPaymentComplete('Failed');
          } finally {
            setLoading(false);
            onClose();
          }
        },
        prefill: {
          name: user ? user.name || '' : '',
          email: user ? user.email || '' : '',
          contact: ''
        },
        theme: {
          color: '#0f172a'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        alert(`Payment Failed: ${response.error.description || 'Transaction cancelled'}`);
        setLoading(false);
      });
      
      onClose(); // close modal to display Razorpay UI
      razorpayInstance.open();
    } catch (err) {
      console.error('Razorpay launch error:', err);
      alert(err.response?.data?.error || 'Failed to launch Razorpay payment.');
      setLoading(false);
    }
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
            style={{ position: 'fixed', top: '50%', left: '50%', width: '100%', maxWidth: '420px', height: 'auto', transform: 'translate(-50%, -50%)', zIndex: 1065 }}
          >
            <div className="modal-dialog modal-dialog-centered w-100 m-0">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                 <div className="bg-dark text-white p-4 text-center position-relative">
                   <button 
                     type="button" 
                     className="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
                     onClick={onClose}
                     aria-label="Close"
                   ></button>
                   <span className="badge bg-primary text-uppercase mb-2" style={{ letterSpacing: '1px' }}>Razorpay Test Gateway</span>
                   <h4 className="fw-bold mb-1">Pay Token Amount</h4>
                   <p className="mb-0 text-white-50 small">{property.title}</p>
                 </div>
                 <div className="p-4 text-center bg-light">
                    <div className="bg-white p-3 rounded-3 shadow-sm border mb-4">
                      <span className="text-muted small text-uppercase d-block mb-1">Token Deposit</span>
                      <h2 className="display-6 fw-bold text-success mb-0">₹50,000</h2>
                    </div>
                    <p className="text-muted small mb-4">
                      Click below to proceed to Razorpay test gateway (Cards, UPI, Netbanking).
                    </p>
                    <div className="d-flex flex-column gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        onClick={handleRazorpayPayment}
                        className="btn btn-primary py-2 fw-bold w-100 d-flex align-items-center justify-content-center gap-2"
                        style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                      >
                        {loading ? (
                          <span>Processing Order...</span>
                        ) : (
                          <>
                            <i className="bi bi-shield-lock-fill"></i> Pay ₹50,000 via Razorpay
                          </>
                        )}
                      </motion.button>
                      <button 
                        disabled={loading}
                        onClick={onClose}
                        className="btn btn-link text-muted text-decoration-none small mt-1"
                      >
                        Cancel
                      </button>
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
