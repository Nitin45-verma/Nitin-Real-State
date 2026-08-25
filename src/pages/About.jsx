import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -25, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } }
};

const values = [
  { icon: 'bi-award-fill', title: 'Excellence', text: 'Uncompromising dedication to curated architectural masterpieces and bespoke service.' },
  { icon: 'bi-shield-check-fill', title: 'Integrity', text: 'Verified sellers, complete legal transparency, and institutional-grade transaction security.' },
  { icon: 'bi-gem-fill', title: 'Luxury', text: 'Ultra-exclusive residential portfolios crafted for high-net-worth buyers worldwide.' }
];

const About = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container py-5 mt-5"
      style={{ minHeight: '80vh' }}
    >
      <div className="text-center mb-5 pt-4">
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill text-uppercase fw-bold mb-2"
        >
          Legacy & Distinction
        </motion.span>
        <h1 className="display-4 fw-bold" style={{ color: 'var(--primary-color)' }}>Our Vision & Philosophy</h1>
        <div style={{ width: '80px', height: '3px', backgroundColor: 'var(--accent-color)', margin: '15px auto 0' }}></div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card card-luxury p-md-5 p-4 border-0 shadow-lg rounded-4"
          >
            <p className="lead fs-4 fw-normal mb-4" style={{ lineHeight: '1.8', color: 'var(--primary-color)' }}>
              At <strong>Nitin Real Estate</strong>, we hold a simple but profound belief: luxury is not just a price point, it is an elevated living experience. For over a decade, we have redefined residential real estate by consistently delivering architectural magnificence to our global clientele.
            </p>
            <p className="text-muted fs-5 mb-5" style={{ lineHeight: '1.8' }}>
              We curate an ultra-exclusive collection of the world's most exquisite properties, seamlessly connecting verified sellers with discerning buyers. Each estate in our portfolio is hand-selected for its unique design character, prime location, and timeless value.
            </p>

            <motion.div 
              className="row text-center g-4 mt-2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {values.map((val, idx) => (
                <motion.div key={idx} className="col-md-4" variants={itemVariant}>
                  <motion.div 
                    whileHover={{ y: -10, scale: 1.04 }}
                    className="p-4 rounded-4 bg-light border border-secondary border-opacity-10 h-100 shadow-sm transition-all"
                  >
                    <div className="kpi-icon-wrapper kpi-gold mx-auto mb-3">
                      <i className={`bi ${val.icon}`}></i>
                    </div>
                    <h5 className="fw-bold fs-4 text-dark">{val.title}</h5>
                    <p className="small text-muted mb-0 mt-2">{val.text}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
