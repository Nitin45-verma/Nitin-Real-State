import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Buyer' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        '/api/auth/register',
        JSON.stringify(formData),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Successfully registered and received token
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      // Explicitly extract error JSON message from the backend or default to standard error
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Registration failed due to a network or server error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
      className="container py-5 mt-5 d-flex justify-content-center align-items-center"
      style={{ minHeight: '80vh' }}
    >
      <div className="card shadow-lg p-5 border-0 w-100" style={{ maxWidth: '600px', borderRadius: '1rem' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Create Account</h2>
          <p className="text-muted">Join Nitin Real Estate today</p>
        </div>
        
        {/* Bootstrap 5 Alert Banner for User Error Visibility */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-bold">Full Name</label>
              <input type="text" className="form-control form-control-lg bg-light" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Email address</label>
              <input type="email" className="form-control form-control-lg bg-light" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Password</label>
              <input type="password" className="form-control form-control-lg bg-light" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">I am a...</label>
              <select className="form-select form-select-lg bg-light" name="role" value={formData.role} onChange={handleChange}>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>
            </div>
            <div className="col-12 mt-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="btn w-100 py-3" 
                style={{ backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 'bold' }}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Register'}
              </motion.button>
            </div>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-muted">Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link></p>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
