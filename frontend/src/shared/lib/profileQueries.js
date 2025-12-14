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

// Helper: Löscht alle alten Avatare des Benutzers
const deleteOldAvatars = async (userId) => {
  const bucket = supabase.storage.from('avatars');
  const { data: existingFiles, error: listError } = await bucket.list(userId);
  
  if (listError) return { error: listError };
  if (!existingFiles || existingFiles.length === 0) return { error: null };

  const filesToDelete = existingFiles.map(f => `${userId}/${f.name}`);
  const { error: deleteError } = await bucket.remove(filesToDelete);
  
  return { error: deleteError };
};

// Helper: Lädt eine neue Avatar-Datei hoch
const uploadAvatarFile = async (userId, file) => {
  const bucket = supabase.storage.from('avatars');
  const filePath = `${userId}/${file.name}`;
  
  const { data: uploadData, error } = await bucket.upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  });

  return { uploadData, filePath, error };
};

// Helper: Holt die öffentliche URL für den Avatar
const getAvatarPublicUrl = (filePath) => {
  const bucket = supabase.storage.from('avatars');
  const { data: pub } = bucket.getPublicUrl(filePath);
  const publicUrl = pub?.publicUrl ?? null;

  if (!publicUrl) {
    return { publicUrl: null, error: new Error('Failed to get public URL') };
  }

  return { publicUrl, error: null };
};

// Helper: Aktualisiert das Profil mit der neuen Avatar-URL
const updateAvatarInProfile = async (userId, publicUrl) => {
  const { data: updatedProfile, error } = await updateProfile(userId, { avatar_url: publicUrl });
  return { updatedProfile, error };
};

// Main: Orchestriert den kompletten Avatar-Upload-Prozess
export const uploadAvatar = async (userId, file) => {
  // 1. Alte Avatare löschen
  const deleteResult = await deleteOldAvatars(userId);
  if (deleteResult.error) return { data: null, error: deleteResult.error };

  // 2. Neuen Avatar hochladen
  const uploadResult = await uploadAvatarFile(userId, file);
  if (uploadResult.error) return { data: null, error: uploadResult.error };

  // 3. Öffentliche URL abrufen
  const urlResult = getAvatarPublicUrl(uploadResult.filePath);
  if (urlResult.error) return { data: null, error: urlResult.error };

  // 4. Profil aktualisieren
  const profileResult = await updateAvatarInProfile(userId, urlResult.publicUrl);
  if (profileResult.error) return { data: null, error: profileResult.error };

  return { 
    data: { 
      upload: uploadResult.uploadData, 
      publicUrl: urlResult.publicUrl, 
      profile: profileResult.updatedProfile 
    }, 
    error: null 
  };
};


//Daniil
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