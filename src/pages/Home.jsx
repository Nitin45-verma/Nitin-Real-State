import { motion } from 'framer-motion';
import heroBg from '../assets/hero_bg.png';
import prop1 from '../assets/prop1.png';
import prop2 from '../assets/prop2.png';
import prop3 from '../assets/prop3.png';
import { Link } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const featuredProperties = [
  { id: 1, title: 'The Glass Horizon', location: 'Beverly Hills, CA', price: '$8,500,000', img: prop1 },
  { id: 2, title: 'Tropical Oasis Villa', location: 'Miami, FL', price: '$12,200,000', img: prop2 },
  { id: 3, title: 'Modern Woodland Estate', location: 'Aspen, CO', price: '$5,900,000', img: prop3 },
];

const Home = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="display-2 fw-bold mb-4"
          >
            Redefining Luxury Living
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="lead mb-5 px-md-5 mx-md-5"
          >
            Discover exclusive properties tailored to your sophisticated lifestyle. Experience real estate excellence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Link to="/buy" className="btn premium-btn me-3 mb-2 mb-md-0">
              Explore Properties
            </Link>
            <Link to="/connect" className="btn premium-btn bg-transparent text-white border-white mb-2 mb-md-0 d-inline-block" style={{color: 'white'}}>
              Consult With Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-5 my-5">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold" style={{color: 'var(--primary-color)'}}>Featured Properties</h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--accent-color)', margin: '0 auto' }}></div>
          </motion.div>

          <motion.div 
            className="row g-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {featuredProperties.map(prop => (
              <motion.div key={prop.id} className="col-lg-4 col-md-6" variants={itemVariant}>
                <motion.div 
                  className="card card-luxury h-100"
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <div style={{ overflow: 'hidden', height: '250px' }}>
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      src={prop.img} 
                      className="card-img-top h-100 w-100 object-fit-cover" 
                      alt={prop.title} 
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold mb-1">{prop.title}</h5>
                    <p className="text-muted small mb-3"><i className="bi bi-geo-alt-fill me-1"></i>{prop.location}</p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className="price-tag">{prop.price}</span>
                      <Link to="/buy" className="btn btn-outline-dark btn-sm rounded-pill px-3">View Details</Link>
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
