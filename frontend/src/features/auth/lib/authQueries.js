import { supabase } from '../../../services/supabaseClient';


export async function signInWithPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function signUpWithPassword(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    return { data, error };
}

// Minimal RPC-based profile creation right after signup.
// Requires a SECURITY DEFINER function, e.g.:
// create or replace function public.create_user_with_profile(p_user_id uuid, p_display_name text, p_avatar_url text default null, p_avatar_path text default null)
// returns public.user_profiles as $$ ... $$ language plpgsql security definer;
// grant execute on function public.create_user_with_profile(uuid, text, text, text) to anon, authenticated;
function getDefaultAvatar() {
    const DEFAULT_PATH = 'avatar_blank.png';
    const { data } = supabase.storage.from('avatars').getPublicUrl(DEFAULT_PATH);
    return { publicUrl: data?.publicUrl ?? null };
}

export async function signUpWithPasswordAndProfile(email, password, { displayName } = {}) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName ?? null } },
    });
    if (signUpError) return { data: null, error: signUpError };

    const user = signUpData?.user ?? null;
    if (!user) return { data: null, error: new Error('Signup did not return a user') };

    const { publicUrl } = getDefaultAvatar();
    // Call RPC as anon/authenticated; function must be SECURITY DEFINER
    const { data: profile, error: rpcError } = await supabase.rpc('create_user_with_profile', {
        p_user_id: user.id,
        p_display_name: displayName ?? null,
        p_avatar_url: publicUrl,
        p_email: email
    });
    if (rpcError) return { data: { user }, error: rpcError };

    return { data: { user, profile }, error: null };
}