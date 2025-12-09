import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/services/supabaseClient';

// Hook to fetch and cache multiple profiles by user ids.
// Uses user_profiles table: id (FK to auth.users.id), display_name, avatar_url, phone_number.
export function useProfilesByIds(userIds) {
    const [profilesMap, setProfilesMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchedRef = useRef(new Set());

    useEffect(() => {
        const uniqueIds = [...new Set((userIds || []).filter(Boolean))];
        const missing = uniqueIds.filter(id => !fetchedRef.current.has(id));
        if (missing.length === 0) return;

        let cancelled = false;
                const fetchProfiles = async () => {
                        setLoading(true);
                        let data = null;
                        let fetchError = null;
                        if (missing.length === 1) {
                                // Avoid potential .in() edge case with single value -> use eq
                                const { data: single, error: singleErr } = await supabase
                                    .from('user_profiles')
                                    .select('id, display_name, avatar_url, phone_number')
                                    .eq('id', missing[0]);
                                data = single;
                                fetchError = singleErr;
                        } else {
                                const { data: batch, error: batchErr } = await supabase
                                    .from('user_profiles')
                                    .select('id, display_name, avatar_url, phone_number')
                                    .in('id', missing);
                                data = batch;
                                fetchError = batchErr;
                        }
                        if (cancelled) return;
                        if (fetchError) {
                                // Fallback: try individual fetches if batch failed and more than one id
                                if (missing.length > 1) {
                                    const results = await Promise.all(missing.map(id => supabase
                                    .from('user_profiles')
                                    .select('id, display_name, avatar_url, phone_number')
                                    .eq('id', id)
                                    .maybeSingle()));
                                    const collected = results.map(r => r.data).filter(Boolean);
                                    if (collected.length) {
                                        setProfilesMap(prev => {
                                            const next = { ...prev };
                                            collected.forEach(p => { next[p.id] = p; fetchedRef.current.add(p.id); });
                                            return next;
                                        });
                                        setError(null);
                                        setLoading(false);
                                        return;
                                    }
                                }
                                setError(fetchError);
                        } else if (data) {
                                setProfilesMap(prev => {
                                        const next = { ...prev };
                                        data.forEach(p => { next[p.id] = p; fetchedRef.current.add(p.id); });
                                        return next;
                                });
                        }
                        setLoading(false);
                };
        fetchProfiles();
        return () => { cancelled = true; };
    }, [userIds]);

    return { profilesMap, loading, error };
}
