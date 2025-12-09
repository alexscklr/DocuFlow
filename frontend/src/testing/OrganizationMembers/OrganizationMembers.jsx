import React, { useEffect, useState } from 'react';
import { useOrganizationMembers } from '@/shared/hooks/useOrganizationMembers';
import { useProfilesByIds } from '@/shared/hooks/useProfilesByIds';

export default function OrganizationMembers({ organizationId }) {
  const { members, loading, error, loadMembers, addMember, removeMember } = useOrganizationMembers(organizationId);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ user_id: '', role_id: '' });

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const submitAdd = async (e) => {
    e.preventDefault();
    if (!form.user_id.trim()) return;
    await addMember({ user_id: form.user_id, role_id: form.role_id || null });
    setForm({ user_id: '', role_id: '' });
    setAdding(false);
  };

  const userIds = members.map(m => m.user_id);
  const { profilesMap } = useProfilesByIds(userIds);

  return (
    <div className="glass p-4 rounded-xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Organization Members</h3>
        <button
          type="button"
          onClick={() => setAdding(a => !a)}
          className="glass glass-btn px-3 py-1"
        >{adding ? '−' : '+'}</button>
      </div>
      {error && <p className="text-[var(--danger)] text-sm">{error.message}</p>}
      {adding && (
        <form onSubmit={submitAdd} className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="user_id"
            value={form.user_id}
            onChange={e => setForm(f => ({ ...f, user_id: e.target.value }))}
            className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
            required
          />
          <input
            type="text"
            placeholder="role_id (optional)"
            value={form.role_id}
            onChange={e => setForm(f => ({ ...f, role_id: e.target.value }))}
            className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
          />
          <button type="submit" disabled={loading} className="glass glass-btn">Add</button>
          <button type="button" onClick={() => { setAdding(false); setForm({ user_id: '', role_id: '' }); }} className="glass glass-btn">Cancel</button>
        </form>
      )}
      <ul className="list-none space-y-2 m-0 p-0">
        {members.map(m => {
          const profile = profilesMap[m.user_id];
          const display = profile?.display_name || m.display_name || profile?.phone_number || m.phone_number || m.user_id;
          return (
            <li key={m.id} className="flex items-center justify-between p-2 rounded border border-[var(--border)] bg-[var(--bg-tertiary)]">
              <span className="text-sm flex items-center gap-2">
                {profile?.avatar_url && (
                  <img src={profile.avatar_url} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                )}
                {display}
                {m.roles?.name && <span className="ml-2 text-[var(--text-secondary)]">({m.roles.name})</span>}
              </span>
              <button
                type="button"
                onClick={() => removeMember(m.id)}
                disabled={loading}
                className="text-xs px-2 py-1 rounded bg-[var(--danger)] text-[var(--text-on-accent)]"
              >Remove</button>
            </li>
          );
        })}
        {members.length === 0 && !loading && (
          <li className="italic text-sm text-[var(--text-secondary)]">Keine Mitglieder</li>
        )}
        {loading && <li className="text-sm text-[var(--text-secondary)]">Lade Mitglieder…</li>}
      </ul>
    </div>
  );
}
