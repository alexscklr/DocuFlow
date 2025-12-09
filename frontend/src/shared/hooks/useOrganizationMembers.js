import { useState, useCallback } from 'react';
import { getOrganizationMembers, updateOrganizationMember, removeOrganizationMember } from '@/shared/lib';
import { supabase } from '@/services/supabaseClient';

export function useOrganizationMembers(organizationId) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMembers = useCallback(async () => {
    if (!organizationId) return { data: [], error: null };
    setLoading(true);
    setError(null);
    const { data, error } = await getOrganizationMembers(organizationId);
    if (!error) {
      const base = data ?? [];
      // Enrich with profile display_name/username
      const ids = [...new Set(base.map(m => m.user_id).filter(Boolean))];
      const roleIds = [...new Set(base.map(m => m.role_id).filter(Boolean))];
      let profileMap = {};
      let rolesMap = {};
      if (ids.length) {
        let profiles = [];
        if (ids.length === 1) {
          const { data: single, error: singleErr } = await supabase
              .from('user_profiles')
              .select('id, display_name, avatar_url, phone_number')
            .eq('id', ids[0]);
          if (!singleErr && single) profiles = single;
        } else {
          const { data: batch, error: batchErr } = await supabase
              .from('user_profiles')
              .select('id, display_name, avatar_url, phone_number')
            .in('id', ids);
          if (batchErr) {
            // Fallback: individual fetches
            const results = await Promise.all(ids.map(id => supabase
                .from('user_profiles')
                .select('id, display_name, avatar_url, phone_number')
              .eq('id', id)
              .maybeSingle()));
            profiles = results.map(r => r.data).filter(Boolean);
          } else {
            profiles = batch || [];
          }
        }
        (profiles || []).forEach(p => { profileMap[p.id] = p; });
      }
      if (roleIds.length) {
        const { data: roles } = await supabase
          .from('roles')
          .select('id, name')
          .in('id', roleIds);
        (roles || []).forEach(r => { rolesMap[r.id] = r; });
      }
      setMembers(base.map(m => ({
        ...m,
        display_name: profileMap[m.user_id]?.display_name || null,
          avatar_url: profileMap[m.user_id]?.avatar_url || null,
          phone_number: profileMap[m.user_id]?.phone_number || null,
        role_name: rolesMap[m.role_id]?.name || null,
      })));
    }
    setError(error);
    setLoading(false);
    return { data, error };
  }, [organizationId]);

  const updateMember = useCallback(async (memberId, updates) => {
    const { data, error } = await updateOrganizationMember(memberId, updates);
    if (!error) setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...updates } : m));
    return { data, error };
  }, []);

  const removeMember = useCallback(async (memberId) => {
    const { data, error } = await removeOrganizationMember(memberId);
    if (!error) setMembers(prev => prev.filter(m => m.id !== memberId));
    return { data, error };
  }, []);

  return { members, loading, error, loadMembers, updateMember, removeMember };
}
