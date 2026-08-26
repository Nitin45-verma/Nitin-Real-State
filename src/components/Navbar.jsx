import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import logoImg from '../assets/logo.jpg';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top py-2">
      <div className="container-fluid px-lg-4">
        <Link className="navbar-brand d-flex align-items-center gap-2 text-nowrap me-3" to="/" onClick={closeNav}>
          <img src={logoImg} alt="Nitin Real Estate Logo" style={{ height: '36px', width: '36px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #d4af37' }} />
          <span className="text-gold-gradient" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold', fontSize: '1.2rem' }}>Nitin Real Estate</span>
        </Link>

        <button 
          className="navbar-toggler border-0 p-2 text-gold" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{ background: 'rgba(212, 175, 55, 0.1)', borderRadius: '10px', border: '1px solid rgba(212, 175, 55, 0.3)' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse justify-content-end ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav align-items-lg-center gap-lg-1">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/" onClick={closeNav}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to="/about" onClick={closeNav}>About</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/buy' ? 'active' : ''}`} to="/buy" onClick={closeNav}>Buy</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/sell' ? 'active' : ''}`} to="/sell" onClick={closeNav}>Sell</Link>
            </li>
            {(user?.role === 'Admin' || user?.email === 'admin@nitinrealestate.com' || user?.email === 'nikn63641@gmail.com') && (
              <li className="nav-item">
                <Link 
                  className={`nav-link fw-bold text-warning d-inline-flex align-items-center gap-1 ${location.pathname === '/admin' ? 'active' : ''}`} 
                  to="/admin"
                  onClick={closeNav}
                >
                  <i className="bi bi-shield-lock-fill text-warning"></i>
                  <span>Admin</span>
                </Link>
              </li>
            )}
            {user ? (
              <li className="nav-item d-flex flex-column flex-lg-row align-items-start align-items-lg-center ms-lg-2 mt-3 mt-lg-0 pt-2 pt-lg-0 border-top border-secondary border-opacity-25 border-lg-0 gap-2">
                <div className="d-flex align-items-center gap-1 text-nowrap">
                  <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-30 rounded-pill px-3 py-2 text-nowrap d-inline-flex align-items-center gap-1" style={{ fontSize: '0.8rem', letterSpacing: '0.3px' }}>
                    <i className="bi bi-person-circle text-warning fs-6"></i>
                    <span className="fw-semibold text-light">{user.name}</span>
                    <span className="text-warning-emphasis ms-1 fw-bold">({user.role})</span>
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 text-nowrap w-100 w-lg-auto"
                  onClick={handleLogout}
                >
                  Logout
                </motion.button>
              </li>
            ) : (
              <li className="nav-item d-flex flex-column flex-lg-row align-items-lg-center gap-2 ms-lg-3 mt-3 mt-lg-0 pt-2 pt-lg-0 border-top border-secondary border-opacity-25 border-lg-0">
                <Link to="/login" onClick={closeNav} className="w-100 w-lg-auto text-decoration-none">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="btn btn-outline-warning rounded-pill px-4 py-2 text-nowrap fw-bold btn-sm w-100 text-uppercase"
                    style={{ letterSpacing: '1px', fontSize: '0.82rem' }}
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register" onClick={closeNav} className="w-100 w-lg-auto text-decoration-none">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="btn btn-warning text-dark rounded-pill px-4 py-2 text-nowrap fw-bold btn-sm w-100 text-uppercase shadow-sm"
                    style={{ letterSpacing: '1px', fontSize: '0.82rem' }}
                  >
                    Register
                  </motion.button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
