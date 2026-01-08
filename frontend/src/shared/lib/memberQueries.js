import supabase from "@/services/supabaseClient";

// Get all user profiles (members)
export const getMembers = async () => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

// Create a new member (user profile)
// Note: This might not be needed if members are created through auth signup
export const createMember = async (details) => {
  const { display_name, email, phone_number } = details || {};
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      display_name,
      email,
      phone_number
    })
    .select()
    .single();
  return { data, error };
};

// Update member (user profile)
export const updateMember = async (memberId, updates) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', memberId)
    .select()
    .single();
  return { data, error };
};

// Delete member (user profile)
export const deleteMember = async (memberId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', memberId);
  return { data, error };
};
