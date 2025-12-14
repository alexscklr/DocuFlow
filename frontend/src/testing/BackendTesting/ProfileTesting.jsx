import { useState } from 'react';
import { uploadAvatar, getProfileByUserId } from '@/shared/lib/profileQueries';
import { useAppData } from '@/shared/context/AppDataContextBase';

export const ProfileTesting = () => {
  const { user, profile: ctxProfile, updateProfile } = useAppData();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(ctxProfile || null);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(ctxProfile?.avatar_url || null);

  const loadProfile = async () => {
    if (!user?.id) {
      setError('Kein Benutzer angemeldet');
      return;
    }
    
    setLoading(true);
    const { data, error: err } = await getProfileByUserId(user.id);
    setLoading(false);
    
    if (err) {
      setError(err.message);
    } else {
      setProfile(data);
      setPreviewUrl(data?.avatar_url || null);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    setLoading(true);
    setError(null);

    const { data, error: err } = await uploadAvatar(user.id, file);
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setProfile(data.profile);
      setPreviewUrl(data.publicUrl);
      // Sync into global context if available
      if (updateProfile) {
        await updateProfile({ avatar_url: data.publicUrl });
      }
    }
  };

  return (
    <div className="space-y-4">
      {!user ? (
        <p className="text-[var(--text-secondary)]">Bitte melden Sie sich an, um Profileinstellungen zu testen.</p>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar Preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-[var(--accent)]"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center border-2 border-[var(--border)]">
                <span className="text-[var(--text-secondary)]">Kein Avatar</span>
              </div>
            )}

            <div className="flex gap-2">
              <label className="glass-btn cursor-pointer">
                Avatar hochladen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={loading}
                  className="hidden"
                />
              </label>

              <button
                onClick={loadProfile}
                disabled={loading}
                className="glass-btn"
              >
                {loading ? 'Lädt...' : 'Profil aktualisieren'}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded bg-[var(--danger)]/20 text-[var(--danger)] text-sm">
              Fehler: {error}
            </div>
          )}

          {profile && (
            <div className="p-3 rounded bg-[var(--bg-secondary)] space-y-2 text-sm">
              <p><strong>Benutzer-ID:</strong> {profile.id}</p>
              <p><strong>Name:</strong> {profile.display_name || 'N/A'}</p>
              <p><strong>Avatar URL:</strong> {profile.avatar_url ? (
                <a href={profile.avatar_url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline">{profile.avatar_url}</a>
              ) : 'N/A'}</p>
              <p><strong>Erstellt:</strong> {profile.created_at ? new Date(profile.created_at).toLocaleString() : 'N/A'}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
