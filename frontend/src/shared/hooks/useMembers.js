import { useState, useCallback } from 'react';
import { getMembers, createMember, updateMember, deleteMember } from '@/shared/lib';

// useMembers: Hook für Member-CRUD und State
export function useMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Members laden
  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await getMembers();
    if (!error) setMembers(data ?? []);
    setError(error);
    setLoading(false);
    return { data, error };
  }, []);

  // Member anlegen
  const addMemberHandler = useCallback(async (details) => {
    const { data, error } = await createMember(details);
    if (!error && data) setMembers((prev) => [data, ...prev]);
    return { data, error };
  }, []);

  // Member aktualisieren
  const updateMemberHandler = useCallback(async (memberId, updates) => {
    const { data, error } = await updateMember(memberId, updates);
    if (!error) setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, ...updates } : m)));
    return { data, error };
  }, []);

  // Member löschen
  const deleteMemberHandler = useCallback(async (memberId) => {
    const { data, error } = await deleteMember(memberId);
    if (!error) setMembers((prev) => prev.filter((m) => m.id !== memberId));
    return { data, error };
  }, []);

  return {
    members,
    loading,
    error,
    loadMembers,
    addMember: addMemberHandler,
    updateMember: updateMemberHandler,
    deleteMember: deleteMemberHandler,
  };
}
