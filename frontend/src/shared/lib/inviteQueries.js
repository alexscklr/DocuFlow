import supabase from '@/services/supabaseClient';

export async function sendOrganizationInvite({ email, organization_id, role_id = null }) {
  const payload = { email, organization_id, role_id };
  const { data, error } = await supabase.from('invitations').insert([payload]).select().maybeSingle();
  return { data, error };
}

export async function sendProjectInvite({ email, project_id, role_id = null }) {
  const payload = { email, project_id, role_id };
  const { data, error } = await supabase.from('invitations').insert([payload]).select().maybeSingle();
  return { data, error };
}

export async function acceptInvite(invitation_id) {
  const { data, error } = await supabase.rpc('accept_invitation', { p_invitation_id: invitation_id });
  return { data, error };
}
