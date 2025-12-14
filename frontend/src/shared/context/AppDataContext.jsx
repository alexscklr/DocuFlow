import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useProfile, useOrganizations } from '../hooks';
import { useAuthSession } from '../hooks/useAuthSession';
import AppDataContext from './AppDataContextBase';

export default function AppDataProvider({ children }) {
  const { session, user, authLoading, authError, signOut, changeEmail } = useAuthSession();
  const { profile, updateProfile } = useProfile(user);

  const {
    organizations,
    loading: orgLoading,
    error: orgError,
    loadOrganizations: loadOrgsRaw,
    addOrganization: addOrgRaw,
    updateOrganization: updateOrgRaw,
    deleteOrganization: deleteOrgRaw
  } = useOrganizations(user?.id);

  const [permissions, setPermissions] = useState({});

  // Combine global loading / error
  const loading = authLoading || orgLoading;
  const error = authError || orgError;

  // Wrap actions in useCallback to stabilize references for useMemo
  const loadOrganizations = useCallback(() => {
    if (user) loadOrgsRaw();
  }, [user, loadOrgsRaw]);

  const addOrganization = useCallback(addOrgRaw, [addOrgRaw]);
  const updateOrganization = useCallback(updateOrgRaw, [updateOrgRaw]);
  const deleteOrganization = useCallback(deleteOrgRaw, [deleteOrgRaw]);

  // Reset permissions if no user
  useEffect(() => {
    if (!user) setPermissions({});
  }, [user]);

  // Auto-load organizations when user appears
  useEffect(() => {
    if (user) loadOrganizations();
  }, [user, loadOrganizations]);

  // Optional: derive permissions from profile or organizations
  useEffect(() => {
    if (user && organizations) {
      // Beispiel: setPermissions aus den Rollen der Org-Mitgliedschaften
      const perms = {};
      organizations.forEach(org => {
        if (org.role) perms[org.id] = org.role; // simple example
      });
      setPermissions(perms);
    }
  }, [user, organizations]);

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
    // Hinweis: Projekte werden über useProjects(organizationId) in Komponenten geladen
  }), [
    session,
    user,
    profile,
    organizations,
    permissions,
    loading,
    error,
    loadOrganizations,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    signOut,
    changeEmail,
    updateProfile
  ]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}
