import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminRoute = ({ children }) => {
  const { user, loading, token, login } = useContext(AuthContext);
  const [promoting, setPromoting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-light">
        <div className="spinner-border text-warning me-2" role="status"></div>
        <span>Loading Admin Portal...</span>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const handlePromoteToAdmin = async () => {
    setPromoting(true);
    setErrorMsg('');
    try {
      const res = await axios.post('http://13.51.201.78:5000/api/admin/make-me-admin');
      if (res.data.success) {
        login(token, res.data.user);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to update user role to Admin');
    } finally {
      setPromoting(false);
    }
  };

  const allowedAdminEmails = ['admin@nitinrealestate.com', 'nikn63641@gmail.com'];
  const isAuthorizedAdminEmail = allowedAdminEmails.includes(user.email);

  if (!isAuthorizedAdminEmail || user.role !== 'Admin') {
    return (
      <div className="container py-5 mt-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-dark text-light border-danger shadow-lg max-w-lg mx-auto p-4 rounded-4"
        >
          <div className="text-center mb-4">
            <i className="bi bi-shield-x text-danger display-3"></i>
            <h2 className="mt-3 text-gold-gradient fw-bold">Admin Panel Access Restricted</h2>
            <p className="text-muted mt-2">
              System Admin privileges are restricted to authorized administrators.
            </p>
            <div className="badge bg-danger bg-opacity-20 text-danger border border-danger px-3 py-2 rounded-pill mt-1">
              Logged in as: {user.email} ({user.role})
            </div>
          </div>

          {errorMsg && (
            <div className="alert alert-danger py-2 mb-3" role="alert">
              {errorMsg}
            </div>
          )}

          {isAuthorizedAdminEmail ? (
            <div className="bg-body-tertiary p-3 rounded-3 mb-2 text-center border border-secondary">
              <h6 className="fw-semibold mb-2">Activate Admin Role</h6>
              <p className="small text-muted mb-3">
                Click below to confirm Admin role activation for <strong>{user.email}</strong>.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePromoteToAdmin}
                disabled={promoting}
                className="btn btn-warning fw-bold px-4 py-2 rounded-pill shadow-sm text-dark"
              >
                {promoting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Activating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-shield-check me-2"></i> Activate Admin Status
                  </>
                )}
              </motion.button>
            </div>
          ) : (
            <div className="alert alert-dark border border-secondary text-center small mb-0 text-slate-light">
              <i className="bi bi-info-circle me-1 text-warning"></i>
              Please log in with authorized admin email <strong>nikn63641@gmail.com</strong> or <strong>admin@nitinrealestate.com</strong> to gain access.
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
