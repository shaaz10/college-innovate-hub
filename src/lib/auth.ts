import { supabase } from '@/integrations/supabase/client';

// Google OAuth helper
export const initiateGoogleAuth = async () => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl
    }
  });
  
  if (error) {
    console.error('Error with Google auth:', error);
    throw error;
  }
};