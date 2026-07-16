import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h4 className="fw-bold mb-3" style={{color: "var(--accent-color)"}}>Nitin Real Estate</h4>
            <p className="text-light opacity-75">
              Premium properties and architectural intelligence. Experience luxury living with unparalleled aesthetics and comfort.
            </p>
          </div>
          <div className="col-lg-4 mb-4 mb-lg-0 text-lg-center">
            <h5 className="text-uppercase mb-3">Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/buy">Buy</Link></li>
              <li><Link to="/sell">Sell</Link></li>
            </ul>
          </div>
          <div className="col-lg-4 text-lg-end">
            <h5 className="text-uppercase mb-3">Contact Us</h5>
            <div className="d-flex flex-column gap-2 text-light opacity-75">
              <p className="mb-0"><i className="bi bi-telephone-fill me-2"></i> +91 9166680296</p>
              <p className="mb-0"><i className="bi bi-envelope-fill me-2"></i> nikn63641@gmail.com</p>
              <div className="mt-3 d-flex gap-3 justify-content-lg-end">
                <i className="bi bi-facebook fs-5 cursor-pointer hover-accent" style={{transition: "color 0.3s ease"}} onMouseOver={e => e.target.style.color = "var(--accent-color)"} onMouseOut={e => e.target.style.color = ""}></i>
                <i className="bi bi-instagram fs-5 cursor-pointer hover-accent" style={{transition: "color 0.3s ease"}} onMouseOver={e => e.target.style.color = "var(--accent-color)"} onMouseOut={e => e.target.style.color = ""}></i>
                <i className="bi bi-linkedin fs-5 cursor-pointer hover-accent" style={{transition: "color 0.3s ease"}} onMouseOver={e => e.target.style.color = "var(--accent-color)"} onMouseOut={e => e.target.style.color = ""}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12 text-center border-top border-secondary pt-4">
            <p className="mb-0 text-light opacity-50 small">&copy; {new Date().getFullYear()} Nitin Real Estate. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
