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
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={closeNav}>
          <img src={logoImg} alt="Nitin Real Estate Logo" style={{ height: '38px', width: '38px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #d4af37' }} />
          <span className="text-gold-gradient" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold', fontSize: '1.25rem' }}>Nitin Real Estate</span>
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
          <ul className="navbar-nav align-items-lg-center">
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
                  className={`nav-link fw-bold text-warning d-flex align-items-center gap-1 ${location.pathname === '/admin' ? 'active' : ''}`} 
                  to="/admin"
                  onClick={closeNav}
                >
                  <i className="bi bi-shield-lock-fill text-warning"></i>
                  <span>Admin</span>
                </Link>
              </li>
            )}
            {user ? (
              <li className="nav-item d-flex flex-column flex-lg-row align-items-start align-items-lg-center ms-lg-3 mt-3 mt-lg-0 pt-2 pt-lg-0 border-top border-secondary border-opacity-25 border-lg-0">
                <p className="me-3 mb-2 mb-lg-0 text-light small"><i className="bi bi-person-circle me-1 text-warning"></i>{user.name} ({user.role})</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 w-100 w-lg-auto"
                  onClick={handleLogout}
                >
                  Logout
                </motion.button>
              </li>
            ) : (
              <li className="nav-item d-flex flex-column flex-lg-row gap-2 ms-lg-3 mt-3 mt-lg-0 pt-2 pt-lg-0 border-top border-secondary border-opacity-25 border-lg-0">
                <Link to="/login" onClick={closeNav} className="w-100 w-lg-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-outline-light rounded-pill px-4 me-lg-2 w-100"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register" onClick={closeNav} className="w-100 w-lg-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn premium-btn rounded-pill px-4 w-100"
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
