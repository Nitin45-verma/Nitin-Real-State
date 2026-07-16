import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.6 } }
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
      setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Failed to send contact message:', err);
      setStatus({ type: 'danger', message: 'Failed to send message. Please try again.' });
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
        <h1 className="display-4 fw-bold" style={{color: 'var(--primary-color)'}}>Get In Touch</h1>
        <div style={{ width: '80px', height: '3px', backgroundColor: 'var(--accent-color)', margin: '0 auto' }}></div>
        <p className="lead mt-3 text-muted">Our dedicated agents are ready to assist you.</p>
      </div>

      <div className="row g-5 justify-content-center">
        <div className="col-lg-4">
          <div className="card card-luxury h-100 p-4 border-0 text-center d-flex justify-content-center align-items-center bg-dark text-white shadow-lg" style={{backgroundColor: 'var(--primary-color) !important'}}>
            <div className="py-5">
              <i className="bi bi-geo-alt-fill display-4 mb-4" style={{color: 'var(--accent-color)'}}></i>
              <h4 className="fw-bold">Headquarters</h4>
              <p className="opacity-75">Nitin Real Estate<br/>Luxury Avenue, Suite 100<br/>Business District, NY 10012</p>

              <i className="bi bi-telephone-fill display-4 mt-5 mb-4" style={{color: 'var(--accent-color)'}}></i>
              <h4 className="fw-bold">Phone</h4>
              <p className="opacity-75">+91 9166680296</p>

              <i className="bi bi-envelope-fill display-4 mt-5 mb-4" style={{color: 'var(--accent-color)'}}></i>
              <h4 className="fw-bold">Email</h4>
              <p className="opacity-75">nikn63641@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card card-luxury p-md-5 p-4 border-0 shadow-sm h-100">
            <h3 className="fw-bold mb-4">Send a Message</h3>
            {status.message && (
              <div className={`alert alert-${status.type} alert-dismissible fade show`} role="alert">
                {status.message}
                <button type="button" className="btn-close" onClick={() => setStatus({type:'', message:''})}></button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="d-flex flex-column h-100">
              <div className="mb-4">
                <label className="form-label fw-bold text-muted">Full Name</label>
                <input type="text" className="form-control form-control-lg bg-light border-0 border-bottom rounded-0" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold text-muted">Email Address</label>
                <input type="email" className="form-control form-control-lg bg-light border-0 border-bottom rounded-0" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
              </div>
              <div className="mb-4 flex-grow-1">
                <label className="form-label fw-bold text-muted">Your Message</label>
                <textarea className="form-control form-control-lg bg-light border-0 border-bottom rounded-0 h-100" name="message" value={formData.message} onChange={handleChange} required placeholder="How can we help you?..."></textarea>
              </div>
              <div className="mt-auto pt-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="btn premium-btn w-100 py-3" 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Inquiry'}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConnectUs;
