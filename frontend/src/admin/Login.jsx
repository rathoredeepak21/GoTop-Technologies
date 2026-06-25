import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Lock, Mail, RefreshCw, AlertCircle } from 'lucide-react';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return;

    setLoading(true);
    setError('');

    try {
      const res = await login(identifier, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setError('Connection failed. Verify your backend server state.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="glow-circle-blue top-10 left-10" />
      <div className="glow-circle-indigo bottom-10 right-10" />

      <div className="max-w-md w-full relative z-10 space-y-8">
        
        {/* Header logo & labels */}
        <div className="text-center">
          <img
            src={settings.logoUrl || '/logo.png'}
            alt="Nexvora Logo"
            className="h-16 w-auto mx-auto mb-4 filter drop-shadow-[0_0_8px_rgba(0,210,255,0.4)]"
          />
          <h2 className="text-3xl font-display font-extrabold text-white uppercase tracking-wider">
            {settings.companyName.split(' ')[0]} Admin
          </h2>
          <p className="mt-2 text-sm text-gray-400 font-light">
            Authorized administrator console credentials required.
          </p>
        </div>

        {/* Card Panel */}
        <div className="glass-panel p-8 rounded-3xl border border-neon-blue/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message banner */}
            {error && (
              <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              
              {/* Identifier input */}
              <div className="space-y-2">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email or Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-space-dark/80 border border-space-border/60 focus:border-neon-blue focus:outline-none rounded-xl py-3 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500"
                    placeholder="admin@nexvora.com"
                  />
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Password input */}
              <div className="space-y-2">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider font-sans">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-space-dark/80 border border-space-border/60 focus:border-neon-blue focus:outline-none rounded-xl py-3 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                </div>
              </div>

            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center space-x-2 w-full text-center text-sm font-semibold text-space-darkest bg-gradient-to-r from-neon-blue to-blue-500 hover:brightness-110 shadow-neon-glow py-3.5 rounded-xl transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <span>Access Console</span>
              )}
            </button>

          </form>
        </div>

        <div className="text-center text-xs text-gray-600">
          IP log event triggered upon access attempt.
        </div>

      </div>
    </div>
  );
};

export default Login;
