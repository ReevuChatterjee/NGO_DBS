import React, { useState } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FaLock, FaUserShield } from 'react-icons/fa';

const Login = ({ setAuth }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Admin Authenticated');
      setAuth(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="card w-full max-w-sm animate-in p-12 border-none shadow-2xl shadow-[#344e41]/10 bg-white">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-[2rem] bg-[#344e41]/5 text-[#344e41] flex items-center justify-center text-5xl mb-6 border border-[#344e41]/10 shadow-inner">
            <FaUserShield />
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-[#2d3a33]">Governance</h2>
          <p className="text-[#8a9a91] mt-3 text-center text-sm font-semibold uppercase tracking-widest">Secure Entry Point</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              value={credentials.username}
              onChange={e => setCredentials({...credentials, username: e.target.value})}
              placeholder="e.g., admin"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              value={credentials.password}
              onChange={e => setCredentials({...credentials, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center mt-4 h-12" disabled={loading}>
            {loading ? 'Authenticating...' : <><FaLock /> Secure Login</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
