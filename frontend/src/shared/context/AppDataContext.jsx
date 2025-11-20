import React, { useCallback, useEffect, useMemo, useState } from 'react';
import supabase from '@/services/supabaseClient';
import { useProfile, useOrganizations } from '../hooks';
import AppDataContext from './AppDataContextBase';

export default function AppDataProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const { profile, updateProfile } = useProfile(user);

  // Organizations & Projects State via Hooks
  const { organizations, loading: orgLoading, error: orgError, loadOrganizations, addOrganization, updateOrganization, deleteOrganization } = useOrganizations(user?.id);
  // Für Projekte: Organisation muss gewählt sein, daher kann man den Hook dynamisch pro OrgId nutzen
  // Beispiel: const { projects, ... } = useProjects(selectedOrgId);
  const [permissions, setPermissions] = useState({});

  // Kombiniertes Loading/Error für globalen Context
  const loading = orgLoading;
  const error = orgError;

  // Session & user bootstrap
  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: { session },
        error: _sessionError,
      } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // Lokale States werden durch die Hooks automatisch zurückgesetzt
    setPermissions({});
  }, []);

  // Auto-load organizations when user appears
  useEffect(() => {
    if (user) {
      loadOrganizations();
    } else {
      setPermissions({});
    }
  }, [user, loadOrganizations]);

  const value = useMemo(() => ({
    // state
    session,
    user,
    profile,
    organizations,
    permissions,
    loading,
    error,
  // actions
    loadOrganizations,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    signOut,
    // profile actions
    updateProfile,
    // Hinweis: Projekte werden jetzt über useProjects(organizationId) in Komponenten geladen
  }), [session, user, profile, organizations, permissions, loading, error, loadOrganizations, addOrganization, updateOrganization, deleteOrganization, signOut, updateProfile]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}
