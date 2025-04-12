
import { supabase } from "@/integrations/supabase/client";

// Sign up with email and password
export async function signUp(email: string, password: string, userData?: {
  firstName?: string;
  lastName?: string;
}) {
  try {
    let metadata = {};
    if (userData) {
      metadata = {
        first_name: userData.firstName,
        last_name: userData.lastName
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) {
      console.error("Error signing up:", error);
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error: any) {
    console.error("Error in signUp service:", error);
    return {
      user: null,
      error: error.message || "An error occurred during sign up",
    };
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error);
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error: any) {
    console.error("Error in signIn service:", error);
    return {
      user: null,
      error: error.message || "An error occurred during sign in",
    };
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error in signOut service:", error);
    return {
      success: false,
      error: error.message || "An error occurred during sign out",
    };
  }
}

// Get current session
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return { session: null, error: error.message };
    }

    return { session: data.session, error: null };
  } catch (error: any) {
    console.error("Error in getCurrentSession service:", error);
    return {
      session: null,
      error: error.message || "An error occurred while getting session",
    };
  }
}

// Reset password
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error("Error resetting password:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error in resetPassword service:", error);
    return {
      success: false,
      error: error.message || "An error occurred during password reset",
    };
  }
}

// Update password
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error("Error updating password:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error in updatePassword service:", error);
    return {
      success: false,
      error: error.message || "An error occurred while updating password",
    };
  }
}
