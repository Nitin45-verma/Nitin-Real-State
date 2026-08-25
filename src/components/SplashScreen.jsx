import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.jpg';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 3 seconds progress bar simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 28); // 28ms * 100 ~ 2800ms + buffer

    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        y: -30,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)',
        zIndex: 99999,
        overflow: 'hidden'
      }}
    >
      <div className="text-center d-flex flex-column align-items-center px-4">
        {/* Animated Circle Wrapper for Logo */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ 
            scale: [0.4, 1.05, 1], 
            opacity: 1,
            boxShadow: [
              '0 0 20px rgba(212, 175, 55, 0.1)',
              '0 0 55px rgba(212, 175, 55, 0.35)',
              '0 0 30px rgba(212, 175, 55, 0.15)'
            ]
          }}
          transition={{
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
            boxShadow: {
              repeat: Infinity,
              duration: 2,
              repeatType: 'reverse'
            }
          }}
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #d4af37',
            marginBottom: '2rem',
            background: '#090d16'
          }}
        >
          <img 
            src={logoImg} 
            alt="Nitin Real Estate Logo" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
        </motion.div>

        {/* Brand Name Text with Gradient and Letter Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-gold-gradient display-4 fw-bold mb-2"
          style={{ 
            fontFamily: 'Playfair Display, serif',
            letterSpacing: '1.5px',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}
        >
          Nitin Real Estate
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="text-light text-uppercase small mb-5"
          style={{ letterSpacing: '4px', fontWeight: '500' }}
        >
          Luxury Living & Estates
        </motion.p>

        {/* Progress Bar Container */}
        <div style={{ width: '180px', height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
          <motion.div 
            style={{ 
              height: '100%', 
              width: `${progress}%`, 
              backgroundColor: '#d4af37',
              boxShadow: '0 0 8px #d4af37'
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
