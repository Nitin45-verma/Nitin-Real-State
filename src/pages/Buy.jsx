import { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import InquiryModal from '../components/InquiryModal';
import PaymentModal from '../components/PaymentModal';
import EMICalculator from '../components/EMICalculator';
import CompareDrawer from '../components/CompareDrawer';
import VisitBookingModal from '../components/VisitBookingModal';
import PropertiesMap from '../components/PropertiesMap';
import PropertyChat from '../components/PropertyChat';
import { getImageUrl } from '../utils/imageUrl';
import { Link } from 'react-router-dom';
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

const MAX_COMPARE = 3;

const Buy = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProperty, setPaymentProperty] = useState(null);

  // --- Visit Booking ---
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitProperty, setVisitProperty] = useState(null);

  // --- Compare ---
  const [compareList, setCompareList] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [chatProperty, setChatProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');

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

  const filteredProperties = properties.filter(prop => {
    const matchesType = selectedType === 'All' || 
      (selectedType === 'Plot' ? (prop.type === 'Plot' || prop.type === 'Plots') : prop.type === selectedType);
    const matchesSearch = prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prop.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

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

      const waMessage = `Hello Nitin Real Estate, I am interested in buying the property ${selectedProperty.title} located at ${selectedProperty.location} for ₹${selectedProperty.price}. My details: ${formData.name}, ${formData.phone}. Msg: ${formData.message}`;
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

  // --- Compare handlers ---
  const toggleCompare = (prop) => {
    setCompareList((prev) => {
      if (prev.includes(prop._id)) return prev.filter(id => id !== prop._id);
      if (prev.length >= MAX_COMPARE) {
        alert(`You can compare up to ${MAX_COMPARE} properties at a time.`);
        return prev;
      }
      return [...prev, prop._id];
    });
  };

  const removeFromCompare = (id) => setCompareList((prev) => prev.filter(i => i !== id));
  const clearCompare = () => setCompareList([]);

  // --- Visit booking handlers ---
  const openVisit = (prop) => {
    setVisitProperty(prop);
    setVisitModalOpen(true);
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
      <div className="text-center mb-4 pt-4">
        <h1 className="display-4 fw-bold" style={{color: 'var(--primary-color)'}}>Exclusive Listings</h1>
        <div style={{ width: '80px', height: '3px', backgroundColor: 'var(--accent-color)', margin: '0 auto' }}></div>
        <p className="lead mt-3 text-muted">Discover our curated selection of premium real estate.</p>
      </div>

      {/* Search and Category Filters */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 col-lg-6 mb-3">
          <div className="input-group shadow-sm rounded-pill overflow-hidden border">
            <span className="input-group-text bg-white border-0 ps-3">
              <i className="bi bi-search text-muted fs-5"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-0 py-2 shadow-none" 
              placeholder="Search by title or location (e.g. Jaipur, Villa, Penthouse)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="btn bg-white text-muted border-0 pe-3" 
                onClick={() => setSearchTerm('')}
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="category-filter-container">
            {['All', 'Villa', 'Apartment', 'Plot'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`btn category-filter-btn rounded-pill px-3 py-2 fw-semibold transition-all ${
                  selectedType === type 
                    ? 'btn-dark shadow-sm' 
                    : 'btn-outline-secondary'
                }`}
                style={{
                  borderColor: selectedType === type ? 'var(--accent-color)' : '#cbd5e1',
                  backgroundColor: selectedType === type ? 'var(--primary-color)' : 'transparent',
                  color: selectedType === type ? '#ffffff' : 'var(--primary-color)'
                }}
              >
                {type === 'All' ? '🏡 All Estates' : type === 'Villa' ? '🏰 Villas' : type === 'Apartment' ? '🏙️ Apartments' : '📐 Plots & Land'}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="col-12 mt-4 text-center">
          <div className="btn-group shadow-sm bg-white rounded-pill p-1 border">
            <button 
              className={`btn rounded-pill px-4 fw-semibold ${viewMode === 'list' ? 'btn-dark text-white' : 'btn-white text-muted'}`}
              onClick={() => setViewMode('list')}
            >
              <i className="bi bi-grid-fill me-2"></i> List View
            </button>
            <button 
              className={`btn rounded-pill px-4 fw-semibold ${viewMode === 'map' ? 'btn-dark text-white' : 'btn-white text-muted'}`}
              onClick={() => setViewMode('map')}
            >
              <i className="bi bi-map-fill me-2"></i> Map View
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{color: 'var(--accent-color)'}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : viewMode === 'map' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-5"
        >
          <PropertiesMap properties={filteredProperties} />
        </motion.div>
      ) : (
        <motion.div 
          className="row g-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {filteredProperties.map((prop, idx) => {
              const isCompared = compareList.includes(prop._id);
              return (
                <motion.div key={prop._id || idx} className="col-lg-4 col-md-6" variants={itemVariant} layoutId={prop._id} exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}>
                  <div className={`premium-property-card h-100 ${isCompared ? 'compare-card-active' : ''}`}>
                    <div className="img-wrapper">
                      <img 
                        src={prop.image ? getImageUrl(prop.image) : fallbackImages[idx % fallbackImages.length]} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackImages[idx % fallbackImages.length];
                        }}
                        alt={prop.title || 'Property'} 
                      />
                      <div className="img-overlay"></div>
                      <div className="prop-badges">
                        <span className="badge-glass-dark">{prop.type}</span>
                        {prop.isVerified && (
                          <span className="badge-glass-gold"><i className="bi bi-shield-check me-1"></i>Verified</span>
                        )}
                      </div>

                      {/* Compare Toggle */}
                      <button
                        className={`compare-toggle-btn ${isCompared ? 'compare-toggle-btn--active' : ''}`}
                        onClick={() => toggleCompare(prop)}
                        title={isCompared ? 'Remove from compare' : 'Add to compare'}
                        aria-label={isCompared ? 'Remove from compare' : 'Add to compare'}
                        style={{ zIndex: 10 }}
                      >
                        <i className={`bi ${isCompared ? 'bi-check-square-fill' : 'bi-plus-square'} me-1`}></i>
                        {isCompared ? 'Comparing' : 'Compare'}
                      </button>

                      {user && (user.id === prop.user_id || user.id === (prop.user_id && prop.user_id._id)) && (
                        <button 
                          onClick={() => handleDelete(prop._id)} 
                          className="btn btn-danger btn-sm position-absolute"
                          style={{
                            top: '55px',
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
                    <div className="card-content">
                      <h5 className="prop-title">{prop.title}</h5>
                      <p className="prop-location"><i className="bi bi-geo-alt-fill"></i>{prop.location}</p>
                      <p className="prop-desc">{prop.description}</p>
                      
                      <div className="prop-divider"></div>
                      <div className="prop-footer mb-3">
                        <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>Price</span>
                        <span className="prop-price">₹{prop.price.toLocaleString()}</span>
                      </div>
                      
                      <div className="d-flex flex-column gap-3 mt-auto">
                        <div className="d-flex gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openInquiry(prop)}
                            className="btn btn-luxury-primary flex-grow-1"
                          >
                            <i className="bi bi-whatsapp me-1"></i>Inquire
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openPayment(prop)}
                            className="btn btn-luxury-secondary flex-grow-1"
                          >
                            <i className="bi bi-credit-card me-1"></i>Pay Token
                          </motion.button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openVisit(prop)}
                          className="btn w-100"
                          id={`book-visit-${prop._id}`}
                          style={{ background: 'var(--primary-color)', color: 'white', padding: '0.65rem', borderRadius: '50px', border: '1px solid var(--primary-color)', fontWeight: '600', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}
                        >
                          <i className="bi bi-calendar2-check me-2"></i>Schedule a Visit
                        </motion.button>
                        {user && user.role === 'Buyer' && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setChatProperty(prop)}
                            className="btn w-100"
                            style={{ background: '#fff', color: 'var(--primary-color)', padding: '0.65rem', borderRadius: '50px', border: '1px solid var(--primary-color)', fontWeight: '600', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}
                          >
                            <i className="bi bi-chat-dots-fill me-2 text-warning"></i>Chat with Seller
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {filteredProperties.length === 0 && (
              <motion.div className="col-12 text-center py-5" variants={itemVariant}>
                <i className="bi bi-house-door text-muted" style={{fontSize: '3rem'}}></i>
                <h4 className="text-muted mt-3">No matching properties found.</h4>
                <p className="text-muted">Try adjusting your search criteria or category filter.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Modals & Widgets ── */}
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
          user={user}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {/* Visit Booking Modal */}
      <VisitBookingModal
        isOpen={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
        property={visitProperty}
      />

      {/* EMI Calculator (FAB) */}
      <EMICalculator />

      {/* Compare Drawer (sticky bar + modal) */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <CompareDrawer
            compareList={compareList}
            properties={properties}
            onRemove={removeFromCompare}
            onClear={clearCompare}
          />
        )}
      </AnimatePresence>
      {/* Property Chat (FAB-like Modal) */}
      {chatProperty && <PropertyChat property={chatProperty} onClose={() => setChatProperty(null)} />}

    </motion.div>
  );
};

export default Buy;
