
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import * as authService from "@/services/authService";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: string | null }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ success: false, error: "Not implemented" }),
  signUp: async () => ({ success: false, error: "Not implemented" }),
  signOut: async () => {},
  resetPassword: async () => ({ success: false, error: "Not implemented" }),
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle auth events
        if (event === 'SIGNED_IN') {
          // Do not fetch additional data here to prevent deadlock
          // Use setTimeout to safely dispatch additional actions
          setTimeout(() => {
            toast.success("Signed in successfully");
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          toast.info("Signed out");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Compute isAuthenticated based on session presence
  const isAuthenticated = !!session;

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.signIn(email, password);
      
      if (result.error) {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during sign in";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      // Call the signUp service with user data
      const result = await authService.signUp(email, password, { firstName, lastName });
      
      if (result.error) {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
      
      // If signup is successful
      toast.success("Account created successfully! You can now sign in.");
      return { success: true, error: null };
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during sign up";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await authService.resetPassword(email);
      
      if (result.error) {
        return { success: false, error: result.error };
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || "An error occurred during password reset" 
      };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
