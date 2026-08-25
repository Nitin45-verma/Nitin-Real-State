import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.jpg';

const Footer = () => {
  return (
    <footer className="footer mt-auto border-top border-secondary border-opacity-30">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src={logoImg} alt="Nitin Real Estate Logo" style={{ height: '48px', width: '48px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #d4af37' }} />
              <h4 className="fw-bold mb-0 text-gold-gradient display-6" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem' }}>Nitin Real Estate</h4>
            </div>
            <p className="text-light opacity-75 lead fs-6">
              Ultra-luxury residential properties and world-class architectural intelligence. Experience real estate excellence with unprecedented sophistication.
            </p>
          </div>
          <div className="col-lg-4 mb-4 mb-lg-0 text-lg-center">
            <h5 className="text-uppercase mb-3 text-gold-gradient fw-bold letter-spacing-1">Navigation</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/" className="text-light hover-accent">Home</Link></li>
              <li><Link to="/about" className="text-light hover-accent">About Vision</Link></li>
              <li><Link to="/buy" className="text-light hover-accent">Buy Properties</Link></li>
              <li><Link to="/sell" className="text-light hover-accent">Sell Estate</Link></li>
              <li><Link to="/connect" className="text-light hover-accent">Private Advisory</Link></li>
            </ul>
          </div>
          <div className="col-lg-4 text-lg-end">
            <h5 className="text-uppercase mb-3 text-gold-gradient fw-bold letter-spacing-1">Direct Contact</h5>
            <div className="d-flex flex-column gap-2 text-light opacity-75">
              <p className="mb-0 fs-6"><i className="bi bi-telephone-fill text-warning me-2"></i> +91 9166680296</p>
              <p className="mb-0 fs-6"><i className="bi bi-envelope-fill text-warning me-2"></i> nikn63641@gmail.com</p>
              <div className="mt-4 d-flex gap-3 justify-content-lg-end justify-content-start">
                {[
                  { name: 'facebook', link: '#' },
                  { name: 'instagram', link: '#' },
                  { name: 'linkedin', link: '#' },
                  { name: 'whatsapp', link: 'https://wa.me/919166680296' }
                ].map((social, idx) => (
                  <motion.a 
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -5, scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    className={`social-card-btn ${social.name}`}
                    title={social.name}
                  >
                    <i className={`bi bi-${social.name} fs-5`}></i>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12 text-center border-top border-secondary border-opacity-30 pt-4">
            <p className="mb-0 text-light opacity-60 small letter-spacing-1">
              &copy; {new Date().getFullYear()} <strong>Nitin Real Estate System</strong>. Crafted for Luxury & Architectural Performance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
