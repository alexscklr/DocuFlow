// useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { getProfileByUserId, updateProfile } from '@/shared/lib/profileQueries';
import { getUserProjects } from "@/shared/lib/profileQueries"; 
import { useAppData } from "@/shared/context/AppDataContextBase";

export function useProfile(user) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.id) {
      getProfileByUserId(user.id).then(({ data }) => setProfile(data));
    } else {
      setProfile(null);
    }
  }, [user]);

  //updates im format { display_name: 'new name', ... }
  const updateProfileData = useCallback(async (updates) => {
    if (!user?.id) return { data: null, error: new Error('No user id') };
    const { data, error } = await updateProfile(user.id, updates);
    if (!error) setProfile(data);
    return { data, error };
  }, [user]);

  return { profile, updateProfile: updateProfileData };
}

export function useUserProjects(userId) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) 
      return;

    getUserProjects(userId).then(({ data }) => {
      setProjects(data || []);
      setLoading(false);
    });
  }, [userId]);
  return { projects, loading };
}