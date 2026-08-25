import { useState, useContext, useEffect, useRef } from 'react';
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

  const handleGoogleCallback = async (response) => {
    setError('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        '/api/auth/google',
        { token: response.credential },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Google Login failed due to a network or server error.');
      }
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
          name: mockName
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Mock Google Login failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const callbackRef = useRef();
  callbackRef.current = handleGoogleCallback;

  useEffect(() => {
    const initializeGoogle = () => {
      const targetDiv = document.getElementById('googleSignInDiv');
      if (window.google && targetDiv && !isMockMode) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (res) => callbackRef.current(res)
        });
        window.google.accounts.id.renderButton(
          targetDiv,
          { theme: 'outline', size: 'large', text: 'signin_with' }
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
              Sign in with Google (Dev Mode)
            </button>
          ) : (
            <div id="googleSignInDiv" style={{ width: '100%' }}></div>
          )}
        </div>

        <div className="text-center mt-4">
          <p className="text-muted">Don't have an account? <Link to="/register" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link></p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
