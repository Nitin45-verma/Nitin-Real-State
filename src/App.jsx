import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import AuraChatbot from './components/AuraChatbot';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import ConnectUs from './pages/ConnectUs';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';

import { AuthProvider } from './context/AuthContext';

function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
      
      <div 
        className="d-flex flex-column min-vh-100" 
        style={{ 
          height: showSplash ? '100vh' : 'auto', 
          overflow: showSplash ? 'hidden' : 'initial',
          opacity: showSplash ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <Navbar />
        <main className="flex-grow-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/connect" element={<ConnectUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <AuraChatbot />
      </div>
    </AuthProvider>
  );
}

export default App;
