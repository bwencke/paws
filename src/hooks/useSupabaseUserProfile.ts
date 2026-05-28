import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useSupabaseSession } from './useSupabaseSession'; // Adjust path to your session hook

// Optional: Define your profile type based on your database schema
export interface UserProfile {
  id: string;
  username?: string;
  avatar_url?: string;
  updated_at?: string;
  is_admin?: boolean;
  // add other profile fields here
}

export function useSupabaseUserProfile() {
  const { user, loading: sessionLoading } = useSupabaseSession();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        // If the session is still loading, wait.
        if (sessionLoading) {
          return;
        }

        // If there's no user, clear the profile state.
        if (!user) {
          if (isMounted) {
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        // Start loading the profile
        if (isMounted) setLoading(true);

        const { data, error: supabaseError } = await supabase
          .from('profiles') // Change this if your table is named differently
          .select('*')
          .eq('id', user.id)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        if (isMounted) {
          setProfile(data as UserProfile);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err);
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    // Cleanup function to prevent state updates if the component unmounts
    return () => {
      isMounted = false;
    };
  }, [user, sessionLoading]);

  // Combined loading state: true if either the session or the profile is loading
  const isCombinedLoading = sessionLoading || loading;

  return { 
    profile, 
    loading: isCombinedLoading, 
    error 
  };
}