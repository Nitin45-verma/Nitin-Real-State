import { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const getSafeErrorMsg = (err, defaultMsg) => {
  if (!err) return defaultMsg;
  if (typeof err === 'string') return err;
  if (err.response && err.response.data) {
    const data = err.response.data;
    if (typeof data.error === 'string') return data.error;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'object' && data.error !== null) {
      return data.error.message || JSON.stringify(data.error);
    }
    if (typeof data === 'string') return data;
  }
  if (err.message && typeof err.message === 'string') return err.message;
  return defaultMsg;
};

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
      if (response.data.user.role === 'Seller') {
        navigate('/sell');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(getSafeErrorMsg(err, 'Registration failed due to a network or server error.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCallback = async (response) => {
    setError('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        '/api/auth/google',
        { 
          token: response.credential,
          role: formData.role 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      login(res.data.token, res.data.user);
      if (res.data.user.role === 'Seller') {
        navigate('/sell');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(getSafeErrorMsg(err, 'Google Registration failed due to a network or server error.'));
    } finally {
      setIsLoading(false);
    }
  };

  const isMockMode = !import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID === 'your_google_client_id.apps.googleusercontent.com';

  const handleMockGoogleLogin = async () => {
    const mockEmail = window.prompt("Enter Mock Google Email for testing:", "dev.googleuser@example.com");
    if (mockEmail === null) return; // User cancelled
    if (!mockEmail.trim()) {
      setError('Email cannot be empty');
      return;
    }

    let mockName = "Dev Google User";
    if (mockEmail !== "dev.googleuser@example.com") {
      const prefix = mockEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      mockName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        '/api/auth/google',
        { 
          token: 'mock_google_token',
          email: mockEmail.trim(),
          name: mockName,
          role: formData.role
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      login(res.data.token, res.data.user);
      if (res.data.user.role === 'Seller') {
        navigate('/sell');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Mock Google Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const callbackRef = useRef();
  useEffect(() => {
    callbackRef.current = handleGoogleCallback;
  }, [handleGoogleCallback]);
  useEffect(() => {
    const initializeGoogle = () => {
      const targetDiv = document.getElementById('googleSignUpDiv');
      if (window.google && targetDiv && !isMockMode) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (res) => callbackRef.current(res)
        });
        window.google.accounts.id.renderButton(
          targetDiv,
          { theme: 'outline', size: 'large', text: 'signup_with' }
        );
      } else if (!isMockMode) {
        // Fallback loader if script isn't loaded yet
        const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (script) {
          script.addEventListener('load', initializeGoogle);
        }
      }
    };

    initializeGoogle();
  }, [isMockMode]);

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

        {/* Information Banner for Sellers */}
        {formData.role === 'Seller' && (
          <div className="alert alert-info border-0 shadow-sm d-flex align-items-start mb-4 rounded-3" role="alert">
            <i className="bi bi-info-circle-fill text-info fs-4 me-3 mt-1"></i>
            <div>
              <strong className="d-block mb-1">Seller Email Verification Required</strong>
              Registering as a <strong>Seller</strong> will automatically dispatch a verification request email to the Administrator. Once approved by the Admin, you will be able to list your properties.
            </div>
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
                {isLoading ? 'Loading...' : formData.role === 'Seller' ? 'Register as Seller' : 'Register'}
              </motion.button>
            </div>
          </div>
        </form>

        <div className="d-flex align-items-center my-4">
          <hr className="flex-grow-1 text-muted" />
          <span className="mx-3 text-muted" style={{ fontSize: '0.9rem' }}>or</span>
          <hr className="flex-grow-1 text-muted" />
        </div>

        <div className="w-100 d-flex justify-content-center mb-2">
          {isMockMode ? (
            <button 
              type="button" 
              className="btn w-100 py-2 d-flex align-items-center justify-content-center border" 
              style={{ backgroundColor: '#fff', color: '#757575', fontWeight: '500', borderRadius: '0.5rem' }}
              onClick={handleMockGoogleLogin}
              disabled={isLoading}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px', marginRight: '10px' }} />
              Sign up with Google (Dev Mode)
            </button>
          ) : (
            <div id="googleSignUpDiv" style={{ width: '100%' }}></div>
          )}
        </div>

        <div className="text-center mt-4">
          <p className="text-muted">Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link></p>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
