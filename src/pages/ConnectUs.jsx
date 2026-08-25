import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.4 } }
};

const ConnectUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await axios.post('/api/contact', formData);
      setStatus({ type: 'success', message: 'Message sent successfully! Our private client team will reach out to you.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Failed to send contact message:', err);
      setStatus({ type: 'danger', message: 'Failed to send message. Please try again later.' });
    } finally {
      setLoading(false);
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
        <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill text-uppercase fw-bold mb-2">Concierge & Advisory</span>
        <h1 className="display-4 fw-bold" style={{ color: 'var(--primary-color)' }}>Get In Touch</h1>
        <div style={{ width: '80px', height: '3px', backgroundColor: 'var(--accent-color)', margin: '15px auto 0' }}></div>
        <p className="lead mt-3 text-muted">Our private luxury advisors are available 24/7 for tailored consultations.</p>
      </div>

      <div className="row g-5 justify-content-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="col-lg-4"
        >
          <div className="card card-luxury h-100 p-4 border-0 text-center d-flex justify-content-center align-items-center bg-dark text-white shadow-lg rounded-4" style={{ backgroundColor: 'var(--primary-color) !important' }}>
            <div className="py-4">
              <motion.div whileHover={{ scale: 1.15, rotate: 5 }}>
                <i className="bi bi-geo-alt-fill display-4 mb-3 d-inline-block" style={{ color: 'var(--accent-color)' }}></i>
              </motion.div>
              <h4 className="fw-bold fs-4 text-gold-gradient">Headquarters</h4>
              <p className="opacity-75 mb-5 fs-6">Nitin Real Estate<br/>Luxury Avenue, Suite 100<br/>Business District, NY 10012</p>

              <motion.div whileHover={{ scale: 1.15, rotate: -5 }}>
                <i className="bi bi-telephone-fill display-4 mb-3 d-inline-block" style={{ color: 'var(--accent-color)' }}></i>
              </motion.div>
              <h4 className="fw-bold fs-4 text-gold-gradient">Direct Phone</h4>
              <p className="opacity-75 mb-5 fs-6">+91 9166680296</p>

              <motion.div whileHover={{ scale: 1.15, rotate: 5 }}>
                <i className="bi bi-envelope-fill display-4 mb-3 d-inline-block" style={{ color: 'var(--accent-color)' }}></i>
              </motion.div>
              <h4 className="fw-bold fs-4 text-gold-gradient">Private Email</h4>
              <p className="opacity-75 mb-0 fs-6">nikn63641@gmail.com</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="col-lg-7"
        >
          <div className="card card-luxury p-md-5 p-4 border-0 shadow-lg h-100 rounded-4">
            <h3 className="fw-bold mb-4 fs-2 text-dark">Send a Private Message</h3>
            {status.message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`alert alert-${status.type} alert-dismissible fade show rounded-3`} 
                role="alert"
              >
                {status.message}
                <button type="button" className="btn-close" onClick={() => setStatus({ type: '', message: '' })}></button>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="d-flex flex-column h-100">
              <div className="mb-4">
                <label className="form-label fw-bold text-slate-light small text-uppercase">Full Name</label>
                <input type="text" className="form-control form-control-lg bg-light border-0 border-bottom rounded-0 px-2" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold text-slate-light small text-uppercase">Email Address</label>
                <input type="email" className="form-control form-control-lg bg-light border-0 border-bottom rounded-0 px-2" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
              </div>
              <div className="mb-4 flex-grow-1">
                <label className="form-label fw-bold text-slate-light small text-uppercase">Your Inquiry</label>
                <textarea className="form-control form-control-lg bg-light border-0 border-bottom rounded-0 px-2 h-100" name="message" rows="4" value={formData.message} onChange={handleChange} required placeholder="Tell us about your property goals or listing inquiry..."></textarea>
              </div>
              <div className="mt-auto pt-3">
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(15, 23, 42, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="btn premium-btn w-100 py-3" 
                  disabled={loading}
                >
                  {loading ? 'Transmitting Message...' : 'Send Inquiry Now'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConnectUs;
