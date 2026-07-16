import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import ConnectUs from './pages/ConnectUs';
import Login from './pages/Login';
import Register from './pages/Register';

import { AuthProvider } from './context/AuthContext';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
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
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
