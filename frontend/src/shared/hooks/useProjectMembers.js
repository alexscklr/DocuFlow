import { useState, useCallback } from 'react';
import { getProjectMembers, addProjectMember, updateProjectMember, removeProjectMember } from '@/shared/lib';
import { supabase } from '@/services/supabaseClient';

export function useProjectMembers(projectId) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMembers = useCallback(async () => {
    if (!projectId) return { data: [], error: null };
    setLoading(true);
    setError(null);
    const { data, error } = await getProjectMembers(projectId);
    if (!error) {
      const base = data ?? [];
      const ids = [...new Set(base.map(m => m.user_id).filter(Boolean))];
      let profileMap = {};
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
      setMembers(base.map(m => ({
        ...m,
        display_name: profileMap[m.user_id]?.display_name || null,
        avatar_url: profileMap[m.user_id]?.avatar_url || null,
        phone_number: profileMap[m.user_id]?.phone_number || null,
      })));
    }
    setError(error);
    setLoading(false);
    return { data, error };
  }, [projectId]);

  const addMember = useCallback(async ({ user_id, role_id = null }) => {
    const { data, error } = await addProjectMember({ project_id: projectId, user_id, role_id });
    if (!error && data) {
      let enriched = data;
      if (user_id) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id, display_name, avatar_url, phone_number')
          .eq('id', user_id)
          .maybeSingle();
        if (profile) {
          enriched = { ...enriched, display_name: profile.display_name, avatar_url: profile.avatar_url, phone_number: profile.phone_number };
        }
      }
      setMembers(prev => [...prev, enriched]);
    }
    return { data, error };
  }, [projectId]);

  const updateMember = useCallback(async (memberId, updates) => {
    const { data, error } = await updateProjectMember(memberId, updates);
    if (!error) setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...updates } : m));
    return { data, error };
  }, []);

  const removeMember = useCallback(async (memberId) => {
    const { data, error } = await removeProjectMember(memberId);
    if (!error) setMembers(prev => prev.filter(m => m.id !== memberId));
    return { data, error };
  }, []);

  return { members, loading, error, loadMembers, addMember, updateMember, removeMember };
}
