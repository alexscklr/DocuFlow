import supabase from '@/services/supabaseClient';

// Supabase RPC uses p_* named params; align payload keys to match SQL signature.
export async function sendOrganizationInvite({ organization_id, email, role_id = null }) {
  const payload = {
    p_organization_id: organization_id,
    p_email: email,
    p_role_id: role_id
  };
  const { data, error } = await supabase.rpc('invite_to_organization', payload);
  return { data, error };
}

export async function sendProjectInvite({ project_id, email, role_id = null }) {
  const payload = {
    p_project_id: project_id,
    p_email: email,
    p_role_id: role_id
  };
  const { data, error } = await supabase.rpc('invite_to_project', payload);
  return { data, error };
}

export async function acceptInvite(token) {
  const { data, error } = await supabase.rpc('accept_invite', {
    p_token: token
  });

  return { data, error };
}

// Currently not supported
// export async function sendInviteEmail({ email, token, type }) {
//   const { data, error } = await supabase.functions.invoke('send-invite-email', {
//     body: {
//       email,
//       token,
//       type
//     }
//   });
//
//   return { data, error };
// }
