import React, { useEffect, useMemo, useState } from 'react';
import { useProfile, useOrganizations } from '../hooks';
import { useAuthSession } from '../hooks/useAuthSession';
import AppDataContext from './AppDataContextBase';

export default function AppDataProvider({ children }) {
  const { session, user, authLoading, authError, signOut, changeEmail } = useAuthSession();
  const { profile, updateProfile } = useProfile(user);

  // Organizations & Projects State via Hooks
  const { organizations, loading: orgLoading, error: orgError, loadOrganizations, addOrganization, updateOrganization, deleteOrganization } = useOrganizations(user?.id);
  // Für Projekte: Organisation muss gewählt sein, daher kann man den Hook dynamisch pro OrgId nutzen
  // Beispiel: const { projects, ... } = useProjects(selectedOrgId);

  const [permissions, setPermissions] = useState({});

  // Kombiniertes Loading/Error für globalen Context (Auth + Orgs)
  const loading = authLoading || orgLoading;
  const error = authError || orgError;

  // Permissions zurücksetzen wenn kein User
  useEffect(() => {
    if (!user) setPermissions({});
  }, [user]);

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
    changeEmail,
    // profile actions
    updateProfile,
    // Hinweis: Projekte werden jetzt über useProjects(organizationId) in Komponenten geladen
  }), [session, user, profile, organizations, permissions, loading, error, loadOrganizations, addOrganization, updateOrganization, deleteOrganization, signOut, changeEmail, updateProfile]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}