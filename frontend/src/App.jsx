import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FaPaw, FaBars, FaTimes, FaHome, FaDog, FaHeart, FaStethoscope, FaDonate, FaHandsHelping, FaUserShield } from 'react-icons/fa';

import Dashboard from './pages/Dashboard';
import Animals from './pages/Animals';
import Adoptions from './pages/Adoptions';
import Admin from './pages/Admin';
import Medical from './pages/Medical';
import Donations from './pages/Donations';
import Volunteers from './pages/Volunteers';
import Login from './pages/Login';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Overview', icon: <FaHome /> },
    { path: '/animals', label: 'Residents', icon: <FaDog /> },
    { path: '/adoptions', label: 'Save a Life', icon: <FaHeart /> },
    { path: '/medical', label: 'Wellbeing', icon: <FaStethoscope /> },
    { path: '/donations', label: 'Support', icon: <FaDonate /> },
    { path: '/volunteers', label: 'Our Pack', icon: <FaHandsHelping /> },
    { path: '/admin', label: 'Governance', icon: <FaUserShield /> },
  ];

  return (
    <>
      <nav className={`sidebar transition-transform duration-500 ${isOpen ? 'translate-x-0' : '-translate-x-[120%]'} lg:translate-x-0`}>
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white text-xl border border-white/5 shadow-inner">
            <FaPaw />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-white leading-tight">Sanctuary</h2>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-white block">Management</span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="text-base opacity-90">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>



      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-6 right-6 z-[110] bg-[#344e41] w-12 h-12 rounded-full shadow-lg text-white flex items-center justify-center text-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-[#344e41]/40 backdrop-blur-sm z-[90]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="app-layout">
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/adoptions" element={<Adoptions />} />
          <Route path="/admin" element={isAuthenticated ? <Admin /> : <Login setAuth={setIsAuthenticated} />} />
          <Route path="/medical" element={<Medical />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/volunteers" element={<Volunteers />} />
        </Routes>
      </main>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1a231f',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid var(--border-color)'
          }
        }}
      />
    </div>
  );
}

export default App;
