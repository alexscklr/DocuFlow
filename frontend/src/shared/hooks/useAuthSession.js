import { useEffect, useState, useCallback } from 'react';
import supabase from '@/services/supabaseClient';

// useAuthSession: kapselt Session & User Handling (Listener + Bootstrap)
export function useAuthSession() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setAuthLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) setAuthError(error);
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // Session/User werden durch Listener zurückgesetzt
  }, []);

  // E-Mail Änderung (Supabase sendet Verifizierungslink an neue Adresse)
  const changeEmail = useCallback(async (newEmail) => {
    setAuthError(null);
    if (!newEmail || !/^[^@]+@[^@]+\.[^@]+$/.test(newEmail)) {
      const error = { message: 'Ungültige E-Mail Adresse' };
      setAuthError(error);
      return { ok: false, error };
    }
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      setAuthError(error);
      return { ok: false, error };
    }
    // Bis zur Verifikation bleibt user.email noch alt
    return { ok: true, pending: true, user: data.user };
  }, []);

  return { session, user, authLoading, authError, signOut, changeEmail };
}
