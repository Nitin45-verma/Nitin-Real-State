import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
        '/api/auth/login',
        JSON.stringify(formData),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Store token and context globally
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      // Explicit backend error capture
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed due to a network or server error.');
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
      <div className="card shadow-lg p-5 border-0 w-100" style={{ maxWidth: '500px', borderRadius: '1rem' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Welcome Back</h2>
          <p className="text-muted">Sign in to your Nitin Real Estate account</p>
        </div>
        
        {/* Bootstrap 5 Alert Banner for User Error Visibility */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-4">
            <label className="form-label fw-bold">Email address</label>
            <input 
              type="email" 
              className="form-control form-control-lg bg-light" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Password</label>
            <input 
              type="password" 
              className="form-control form-control-lg bg-light" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn w-100 py-3 mt-3" 
            style={{ backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 'bold' }}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </motion.button>
        </form>
        <div className="text-center mt-4">
          <p className="text-muted">Don't have an account? <Link to="/register" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link></p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
