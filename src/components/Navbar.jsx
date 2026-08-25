import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import logoImg from '../assets/logo.jpg';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={logoImg} alt="Nitin Real Estate Logo" style={{ height: '42px', width: '42px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #d4af37' }} />
          <span className="text-gold-gradient" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold' }}>Nitin Real Estate</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/buy' ? 'active' : ''}`} to="/buy">Buy</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/sell' ? 'active' : ''}`} to="/sell">Sell</Link>
            </li>
            {(user?.role === 'Admin' || user?.email === 'admin@nitinrealestate.com' || user?.email === 'nikn63641@gmail.com') && (
              <li className="nav-item">
                <Link 
                  className={`nav-link fw-bold text-warning d-flex align-items-center gap-1 ${location.pathname === '/admin' ? 'active' : ''}`} 
                  to="/admin"
                >
                  <i className="bi bi-shield-lock-fill text-warning"></i>
                  <span>Admin</span>
                </Link>
              </li>
            )}
            {user ? (
              <li className="nav-item d-flex align-items-center ms-lg-3 mt-3 mt-lg-0">
                <p className="me-3 mb-0 text-light"><i className="bi bi-person-circle me-1"></i>{user.name} ({user.role})</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline-danger btn-sm rounded-pill px-3"
                  onClick={handleLogout}
                >
                  Logout
                </motion.button>
              </li>
            ) : (
              <>
                <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-outline-light rounded-pill px-4 me-2"
                    >
                      Login
                    </motion.button>
                  </Link>
                </li>
                <li className="nav-item mt-3 mt-lg-0">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn premium-btn rounded-pill px-4"
                    >
                      Register
                    </motion.button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
