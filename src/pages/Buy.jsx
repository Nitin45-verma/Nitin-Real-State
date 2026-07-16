import { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import InquiryModal from '../components/InquiryModal';
import PaymentModal from '../components/PaymentModal';
import prop1 from '../assets/prop1.png';
import prop2 from '../assets/prop2.png';
import prop3 from '../assets/prop3.png';
import heroBg from '../assets/hero_bg.png';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Fallback images for our gallery
const fallbackImages = [prop1, prop2, prop3, heroBg];

const Buy = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProperty, setPaymentProperty] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('/api/properties');
        setProperties(res.data);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`/api/properties/${id}`);
        setProperties(properties.filter(p => p._id !== id));
      } catch (err) {
        alert("Failed to delete property. Check console.");
        console.error(err);
      }
    }
  };

  const openInquiry = (prop) => {
    setSelectedProperty(prop);
    setModalOpen(true);
  };

  const handleInquirySubmit = async (formData) => {
    try {
      await axios.post('/api/inquiries', {
        buyer_id: user ? user.id : undefined,
        property_id: selectedProperty._id,
        name: formData.name,
        phone: formData.phone,
        message: formData.message
      });

      const waMessage = `Hello Nitin Real Estate, I am interested in buying the property ${selectedProperty.title} located at ${selectedProperty.location} for $${selectedProperty.price}. My details: ${formData.name}, ${formData.phone}. Msg: ${formData.message}`;
      const url = `https://wa.me/919166680296?text=${encodeURIComponent(waMessage)}`;
      
      setModalOpen(false);
      window.open(url, '_blank');
    } catch(err) {
      alert("Failed to submit inquiry.");
      console.error(err);
    }
  };

  const openPayment = (prop) => {
    if (!user) {
      alert("Please log in or register to pay the token amount.");
      return;
    }
    setPaymentProperty(prop);
    setPaymentModalOpen(true);
  };

  const handlePaymentComplete = async (status) => {
    try {
      const resIntent = await axios.post('/api/payment/create-intent', {
        property_id: paymentProperty._id,
        amount: 50000 
      });
      
      await axios.post('/api/payment/verify', {
        transactionId: resIntent.data.transactionId,
        status: status
      });
      
      if(status === 'Success') {
        alert("Payment successful! Token secured.");
      } else {
        alert("Payment was declined.");
      }
    } catch (err) {
      alert("Payment process failed.");
      console.error(err);
    } finally {
      setPaymentModalOpen(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container py-5 mt-5"
      style={{ minHeight: '80vh' }}
    >
      <div className="text-center mb-5 pt-4">
        <h1 className="display-4 fw-bold" style={{color: 'var(--primary-color)'}}>Exclusive Listings</h1>
        <div style={{ width: '80px', height: '3px', backgroundColor: 'var(--accent-color)', margin: '0 auto' }}></div>
        <p className="lead mt-3 text-muted">Discover our curated selection of premium real estate.</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{color: 'var(--accent-color)'}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <motion.div 
          className="row g-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {properties.map((prop, idx) => (
              <motion.div key={prop._id || idx} className="col-lg-4 col-md-6" variants={itemVariant} layoutId={prop._id} exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}>
                <div className="card card-luxury h-100">
                  <div style={{ overflow: 'hidden', height: '250px', position: 'relative' }}>
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      src={prop.image ? `${prop.image}` : fallbackImages[idx % fallbackImages.length]} 
                      className="card-img-top h-100 w-100 object-fit-cover" 
                      alt={prop.title} 
                    />
                    {user && (user.id === prop.user_id || user.id === (prop.user_id && prop.user_id._id)) && (
                      <button 
                        onClick={() => handleDelete(prop._id)} 
                        className="btn btn-danger btn-sm position-absolute"
                        style={{
                          top: '15px',
                          right: '15px',
                          zIndex: 10,
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(220, 53, 69, 0.35)',
                          background: 'rgba(220, 53, 69, 0.9)',
                          backdropFilter: 'blur(4px)',
                          transition: 'all 0.2s ease'
                        }}
                        title="Delete Property"
                      >
                        <i className="bi bi-trash-fill fs-6 text-white"></i>
                      </button>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title fw-bold mb-0">{prop.title}</h5>
                      <span className="badge bg-dark rounded-pill">{prop.type}</span>
                    </div>
                    <p className="text-muted small mb-3"><i className="bi bi-geo-alt-fill me-1"></i>{prop.location}</p>
                    <p className="card-text text-muted small flex-grow-1">{prop.description}</p>
                    
                    <div className="mt-3 pt-3 border-top d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>Price</span>
                        <span className="price-tag">${prop.price.toLocaleString()}</span>
                      </div>
                      <div className="d-flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openInquiry(prop)}
                          className="btn btn-luxury-primary flex-grow-1"
                        >
                          <i className="bi bi-whatsapp me-2"></i>Inquire
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openPayment(prop)}
                          className="btn btn-luxury-secondary flex-grow-1"
                        >
                          <i className="bi bi-credit-card me-2"></i>Pay Token
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {properties.length === 0 && (
              <motion.div className="col-12 text-center py-5" variants={itemVariant}>
                <i className="bi bi-house-door text-muted" style={{fontSize: '3rem'}}></i>
                <h4 className="text-muted mt-3">No properties available at the moment.</h4>
                <p className="text-muted">Stay tuned for upcoming exclusive listings.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {selectedProperty && (
        <InquiryModal 
          key={selectedProperty._id}
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          property={selectedProperty} 
          buyer={user} 
          onSubmit={handleInquirySubmit} 
        />
      )}

      {paymentProperty && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          property={paymentProperty}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </motion.div>
  );
};

export default Buy;
