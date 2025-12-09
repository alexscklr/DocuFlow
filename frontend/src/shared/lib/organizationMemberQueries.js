import supabase from '@/services/supabaseClient';

// Mitglieder einer Organisation laden (inkl. Profile falls vorhanden)
export const getOrganizationMembers = async (organizationId) => {
  const { data, error } = await supabase
    .from('organization_members')
    .select('id, organization_id, user_id, role_id, created_at')
    .eq('organization_id', organizationId);
  return { data, error };
};

// Einzelnes Mitglied hinzufügen. Erwartet user_id & optional role_id
export const addOrganizationMember = async ({ organization_id, user_id, role_id = null }) => {
  const { data, error } = await supabase
    .from('organization_members')
    .insert({ organization_id, user_id, role_id })
    .select('id, organization_id, user_id, role_id, created_at')
    .maybeSingle();
  return { data, error };
};

// Rolle / andere Felder eines Mitglieds aktualisieren
export const updateOrganizationMember = async (memberId, updates) => {
  const { data, error } = await supabase
    .from('organization_members')
    .update(updates)
    .eq('id', memberId)
    .select('id, organization_id, user_id, role_id, created_at')
    .maybeSingle();
  return { data, error };
};

// Mitglied entfernen
export const removeOrganizationMember = async (memberId) => {
  const { data, error } = await supabase
    .from('organization_members')
    .delete()
    .eq('id', memberId)
    .select('id')
    .maybeSingle();
  return { data, error };
};
