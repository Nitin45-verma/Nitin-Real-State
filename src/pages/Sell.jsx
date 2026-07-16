import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.5 } }
};

const Sell = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', location: '', type: 'Apartment', contactInfo: ''
  });
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if(image) data.append('image', image);

      await axios.post('/api/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ type: 'success', message: 'Property submitted successfully! Our agents will contact you shortly.' });
      setFormData({ title: '', description: '', price: '', location: '', type: 'Apartment', contactInfo: '' });
    } catch (err) {
      console.error('Failed to submit property:', err);
      setStatus({ type: 'danger', message: 'Failed to submit property. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'Seller') {
    return (
      <div className="container py-5 mt-5 text-center" style={{ minHeight: '80vh' }}>
        <h2 className="text-muted mt-5"><i className="bi bi-lock-fill me-2"></i>Access Restricted</h2>
        <p>You must be registered and logged in as a <strong>Seller</strong> to list properties.</p>
      </div>
    );
  }

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
        <h1 className="display-4 fw-bold" style={{color: 'var(--primary-color)'}}>Sell Your Property</h1>
        <div style={{ width: '80px', height: '3px', backgroundColor: 'var(--accent-color)', margin: '0 auto' }}></div>
        <p className="lead mt-3 text-muted">Join the most exclusive real estate portfolio in the world.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card card-luxury p-md-5 p-4 border-0 shadow-lg">
            {status.message && (
              <div className={`alert alert-${status.type} alert-dismissible fade show`} role="alert">
                {status.message}
                <button type="button" className="btn-close" onClick={() => setStatus({type:'', message:''})}></button>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Property Title</label>
                  <input type="text" className="form-control form-control-lg bg-light" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Modern Glass Villa" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Property Type</label>
                  <select className="form-select form-select-lg bg-light" name="type" value={formData.type} onChange={handleChange}>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Price ($)</label>
                  <input type="number" className="form-control form-control-lg bg-light" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 5000000" min="0" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Location</label>
                  <input type="text" className="form-control form-control-lg bg-light" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Beverly Hills, CA" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">Contact Information</label>
                  <input type="text" className="form-control form-control-lg bg-light" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required placeholder="Phone number or Email address" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">Property Image</label>
                  <input type="file" className="form-control form-control-lg bg-light" accept="image/*" onChange={handleImageChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">Description</label>
                  <textarea className="form-control form-control-lg bg-light" name="description" rows="4" value={formData.description} onChange={handleChange} required placeholder="Describe the exclusive features of your property..."></textarea>
                </div>
                <div className="col-12 text-center mt-5">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="btn premium-btn w-100 py-3" 
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'List My Property'}
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sell;
