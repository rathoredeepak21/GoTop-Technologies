import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Handle User Auth changes
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setAdmin({
            uid: session.user.id,
            email: session.user.email,
            username: session.user.email.split('@')[0],
            role: 'admin'
          });
          setIsAuthenticated(true);
        } else {
          setAdmin(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error fetching Supabase auth session:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setAdmin({
          uid: session.user.id,
          email: session.user.email,
          username: session.user.email.split('@')[0],
          role: 'admin'
        });
        setIsAuthenticated(true);
      } else {
        setAdmin(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      const user = data.user;
      setAdmin({
        uid: user.id,
        email: user.email,
        username: user.email.split('@')[0],
        role: 'admin'
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Supabase Auth Login Error:', error.message);
      return { success: false, message: error.message || 'Authentication failed. Please verify credentials.' };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setAdmin(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Supabase Auth Logout Error:', error);
      return { success: false, message: 'Sign out failed.' };
    }
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
