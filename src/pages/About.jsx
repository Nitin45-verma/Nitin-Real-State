import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.5 } }
};

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
        <h1 className="display-4 fw-bold" style={{color: 'var(--primary-color)'}}>Our Vision</h1>
        <div style={{ width: '80px', height: '3px', backgroundColor: 'var(--accent-color)', margin: '0 auto' }}></div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card card-luxury p-md-5 p-4 border-0 shadow-lg"
          >
            <p className="lead" style={{ lineHeight: '1.8' }}>
              At <strong>Nitin Real Estate</strong>, we hold a simple but profound belief: luxury is not just a price point, it is an experience. For over a decade, we have redefined the standards of residential real estate by consistently delivering unparalleled architectural magnificence to our elite clientele.
            </p>
            <p className="text-muted" style={{ lineHeight: '1.8' }}>
              We curate a collection of the world's most exquisite properties, connecting visionary sellers with distinctive buyers. Each home in our portfolio is selected for its unique character, premium location, and superior craftsmanship.
            </p>

            <div className="row mt-5 text-center g-4">
              <motion.div 
                className="col-md-4"
                whileHover={{ scale: 1.05 }}
              >
                <i className="bi bi-award fs-1" style={{color: 'var(--accent-color)'}}></i>
                <h5 className="mt-3 fw-bold">Excellence</h5>
                <p className="small text-muted">Award-winning service across standard metrics.</p>
              </motion.div>
              <motion.div 
                className="col-md-4"
                whileHover={{ scale: 1.05 }}
              >
                <i className="bi bi-shield-check fs-1" style={{color: 'var(--accent-color)'}}></i>
                <h5 className="mt-3 fw-bold">Integrity</h5>
                <p className="small text-muted">Transparent transactions with dedicated support.</p>
              </motion.div>
              <motion.div 
                className="col-md-4"
                whileHover={{ scale: 1.05 }}
              >
                <i className="bi bi-gem fs-1" style={{color: 'var(--accent-color)'}}></i>
                <h5 className="mt-3 fw-bold">Luxury</h5>
                <p className="small text-muted">Premium exclusive listings from around the globe.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
