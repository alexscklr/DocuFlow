import { supabase } from "../../services/supabaseClient";


// Fetch user profile by user ID
// data.id corresponds to auth.users.id, data.display_name, data.avatar_url, etc.
export const getProfileByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

// Update user profile
// updates can include display_name, avatar_url, etc.
// example: updates = { display_name: "New Name", avatar_url: "https://..." }
export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

export const uploadAvatar = async (userId, file) => {
  const filePath = `avatars/${userId}/${file.name}`;
  const { data, error } = await supabase.storage.from('avatars').upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  });
  return { data, error };
}

export async function getUserProjects(userId) {
  const { data, error } = await supabase
    .from("project_members")
    .select(`
      id,
      role:roles(name),
      project:projects(
        id,
        name,
        organization:organizations(name)
      )
    `)
    .eq("user_id", userId);

  return { data, error };
}