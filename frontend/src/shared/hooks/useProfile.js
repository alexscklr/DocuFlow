// useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { getProfileByUserId, updateProfile } from '@/shared/lib/profileQueries';

export function useProfile(user) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.id) {
      getProfileByUserId(user.id).then(({ data }) => setProfile(data));
    } else {
      setProfile(null);
    }
  }, [user]);

  const updateProfileData = useCallback(async (updates) => {
    if (!user?.id) return { data: null, error: new Error('No user id') };
    const { data, error } = await updateProfile(user.id, updates);
    if (!error) setProfile(data);
    return { data, error };
  }, [user]);

  return { profile, updateProfile: updateProfileData };
}