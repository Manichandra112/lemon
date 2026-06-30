import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if user is already logged in on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch additional profile data from public.users table
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setAuthUser(profile);
          } else {
            // Profile doesn't exist in public table, fallback to auth metadata
            const fallbackProfile = {
              id: session.user.id,
              email: session.user.email,
              role: session.user.user_metadata?.role || 'customer',
              name: session.user.user_metadata?.name || '',
              phone: session.user.user_metadata?.phone || ''
            };
            setAuthUser(fallbackProfile);
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setAuthUser(profile);
        } else {
          setAuthUser({
            id: session.user.id,
            email: session.user.email,
            role: session.user.user_metadata?.role || 'customer',
            name: session.user.user_metadata?.name || '',
            phone: session.user.user_metadata?.phone || ''
          });
        }
      } else {
        setAuthUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        // Fetch user profile from the public 'users' table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          setAuthUser(profile);
          return { success: true, user: profile };
        } else {
          // If profile row doesn't exist, create one
          const newProfile = {
            id: data.user.id,
            email: data.user.email,
            role: data.user.user_metadata?.role || 'customer',
            name: data.user.user_metadata?.name || '',
            phone: data.user.user_metadata?.phone || ''
          };

          const { data: createdProfile } = await supabase
            .from('users')
            .insert([newProfile])
            .select()
            .single();

          setAuthUser(createdProfile || newProfile);
          return { success: true, user: createdProfile || newProfile };
        }
      }
      return { success: false, error: 'User login failed' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const signup = async (email, password, name, phone, role) => {
    try {
      // 1. Sign up the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            role: role || 'customer',
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const signedUpUser = data.user;
        const fallbackProfile = {
          id: signedUpUser.id,
          email,
          role: role || 'customer',
          name,
          phone
        };

        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;

        if (!session?.user) {
          // Email confirmation required or session not active yet.
          return { success: true, user: fallbackProfile, needsEmailConfirmation: true };
        }

        // Create the user profile in the public 'users' table only when auth session is active
        const { data: createdProfile, error: profileError } = await supabase
          .from('users')
          .insert([fallbackProfile])
          .select()
          .single();

        if (profileError) {
          console.error('Error creating public profile:', profileError);
          return { success: false, error: profileError.message || 'Unable to create user profile' };
        }

        setAuthUser(createdProfile);
        return { success: true, user: createdProfile };
      }

      return { success: false, error: 'Signup failed' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return { success: false, error: 'No active session found' };
      }

      const { data, error } = await supabase
        .from('users')
        .update(updatedData)
        .eq('id', session.user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setAuthUser(data);
      return { success: true, user: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAuthUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    authUser,
    loading,
    login,
    signup,
    updateProfile,
    logout,
    isAuthenticated: !!authUser,
    isAdmin: authUser?.role === 'admin',
    isCustomer: authUser?.role === 'customer'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
