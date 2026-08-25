import { motion } from 'framer-motion';
import heroBg from '../assets/hero_bg.png';
import prop1 from '../assets/prop1.png';
import prop2 from '../assets/prop2.png';
import prop3 from '../assets/prop3.png';
import { Link } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.1 }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const featuredProperties = [
  { id: 1, title: 'The Glass Horizon', location: 'Beverly Hills, CA', price: '₹8,500,000', img: prop1, tag: 'Villa' },
  { id: 2, title: 'Tropical Oasis Villa', location: 'Miami, FL', price: '₹12,200,000', img: prop2, tag: 'Villa' },
  { id: 3, title: 'Modern Woodland Estate', location: 'Aspen, CO', price: '₹5,900,000', img: prop3, tag: 'Apartment' },
];

const stats = [
  { icon: 'bi-briefcase-fill', count: '₹2.5B+', label: 'Portfolio Transacted' },
  { icon: 'bi-houses-fill', count: '450+', label: 'Exclusive Properties' },
  { icon: 'bi-award-fill', count: '100%', label: 'Verified Sellers' },
  { icon: 'bi-star-fill', count: '4.9/5', label: 'Client Satisfaction' }
];

const Home = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Section with Main Background Image */}
      <section 
        className="hero-section d-flex flex-column justify-content-between py-5" 
        style={{ 
          backgroundImage: `url(${heroBg})`, 
          minHeight: '100vh', 
          height: 'auto', 
          paddingTop: '110px',
          paddingBottom: '40px' 
        }}
      >
        <div className="hero-overlay"></div>

        {/* Hero Text & Actions */}
        <div className="hero-content container my-auto py-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-3"
          >
            <span className="badge badge-glow-gold px-4 py-2 rounded-pill text-uppercase fw-bold letter-spacing-1 floating-anim">
              <i className="bi bi-gem me-2"></i>Exclusive Estate Collection
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="display-2 fw-bold mb-4"
          >
            Redefining <span className="text-gold-gradient">Luxury Living</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lead mb-5 px-md-5 mx-md-5 fs-4 text-light text-opacity-90"
            style={{ fontWeight: '300' }}
          >
            Discover handpicked architectural masterpieces and ultra-premium estates across prime worldwide destinations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="d-flex justify-content-center gap-3 flex-wrap"
          >
            <Link to="/buy">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(212, 175, 55, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="btn premium-btn me-md-2"
              >
                Explore Listings <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
              </motion.button>
            </Link>
            <Link to="/connect">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn premium-btn bg-transparent text-white border-white"
              >
                Private Consultation
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Counter Section - Inside Hero so Hero Background Image is Visible */}
        <div className="hero-content container mt-auto pt-4">
          <motion.div 
            className="row g-4 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div key={index} className="col-6 col-lg-3" variants={itemVariant}>
                <motion.div 
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="p-4 rounded-4 glass-card h-100 border border-light border-opacity-20 shadow-lg"
                  style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                >
                  <i className={`bi ${stat.icon} text-warning fs-1 mb-2 d-block`}></i>
                  <h2 className="fw-extrabold text-gold-gradient display-6 mb-1">{stat.count}</h2>
                  <p className="text-light opacity-75 mb-0 small text-uppercase fw-semibold">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-5 my-5">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-5"
          >
            <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill text-uppercase fw-bold mb-2">Curated Portfolio</span>
            <h2 className="display-4 fw-bold" style={{color: 'var(--primary-color)'}}>Featured Luxury Properties</h2>
            <div style={{ width: '80px', height: '3px', backgroundColor: 'var(--accent-color)', margin: '15px auto 0' }}></div>
          </motion.div>

          <motion.div 
            className="row g-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
          >
            {featuredProperties.map(prop => (
              <motion.div key={prop.id} className="col-lg-4 col-md-6" variants={itemVariant}>
                <motion.div 
                  className="card card-luxury h-100 shadow-sm"
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <div style={{ overflow: 'hidden', height: '260px', position: 'relative' }}>
                    <motion.img 
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6 }}
                      src={prop.img} 
                      className="card-img-top h-100 w-100 object-fit-cover" 
                      alt={prop.title} 
                    />
                    <span className="badge badge-glow-gold position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill fw-bold">
                      {prop.tag}
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold fs-4 mb-2">{prop.title}</h5>
                    <p className="text-muted small mb-4"><i className="bi bi-geo-alt-fill text-warning me-1"></i>{prop.location}</p>
                    <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                      <span className="price-tag">{prop.price}</span>
                      <Link to="/buy" className="btn btn-luxury-primary">
                        View Estate
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
