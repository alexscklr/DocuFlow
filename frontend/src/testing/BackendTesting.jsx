import React, { useEffect, useState } from 'react';
import { useAppData } from '@/shared/context/AppDataContextBase';


export const BackendTesting = () => {
    // Organization creation form state
    const [formData, setformData] = useState({ name: '', description: '' });
    const [orgData, setOrgData] = useState(null);

    // Global app data (user, orgs, actions)
    const {
        user,
        organizations,
        loading,
        error,
        addOrganization,
        updateOrganization,
        deleteOrganization,
        loadOrganizations,
    } = useAppData();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await addOrganization({ name: formData.name, description: formData.description });
        if (!error) setOrgData(data);
    };

    useEffect(() => {
        console.log("Organization creation data:", orgData);
    }, [orgData]);

    // Fetch and display organizations
    const fetchOrganizations = async () => {
        const { data, error } = await loadOrganizations();
        if (error) {
            console.error('Error fetching organizations:', error);
        } else {
            console.log('Fetched organizations:', data);
        }
    };

    return (
        <div className="glass min-h-screen w-full flex flex-col items-center justify-start py-8 gap-6">
            <h1 className="text-3xl font-bold mb-8">Testing Page</h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 glass p-6 w-stretch"
            >
                <h2 className="text-xl font-semibold mb-2">Create Organization Test Page</h2>
                <input
                    type="text"
                    placeholder="Organization Name"
                    value={formData.name}
                    onChange={(e) => setformData({ ...formData, name: e.target.value })}
                    className="px-3 py-2 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    required
                />
                <input
                    type="text"
                    placeholder="Organization Description"
                    value={formData.description}
                    onChange={(e) => setformData({ ...formData, description: e.target.value })}
                    className="px-3 py-2 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <button
                    type="submit"
                    className="glass glass-btn mt-4 px-6 w-39 whitespace-nowrap"
                    disabled={loading}
                >
                    {loading ? 'Creating…' : 'Create Organization'}
                </button>
            </form>

            {orgData && (
                <div className="mt-6 w-full max-w-md border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] p-4 shadow">
                    <h2 className="text-lg font-semibold mb-1">Organization Created:</h2>
                    <p className="text-[var(--success)]">
                        Name: {orgData.name} <br />
                        Description: {orgData.description}
                    </p>
                </div>
            )}

            <section className="glass p-6 w-stretch flex flex-col gap-6">
                <h2 className="text-xl font-semibold mb-2">Get Organizations of User</h2>
                <button
                    type="button"
                    onClick={fetchOrganizations}
                    disabled={loading}
                    className="glass glass-btn"
                >
                    Fetch Organizations {loading ? '…' : '⟳'}
                </button>
                {error && <p className="text-[var(--danger)] mb-2">Error: {error.message}</p>}
                {!user && <p className="text-[var(--warning)] mb-2">Bitte einloggen, um Organizations zu sehen.</p>}
                <ul className="space-y-2">
                    {organizations.map((org) => (
                        <OrganizationRow
                          key={org.id}
                          org={org}
                          onUpdate={updateOrganization}
                          onDelete={deleteOrganization}
                          globalLoading={loading}
                        />
                    ))}
                </ul>
            </section>
        </div>
    );
}

// Small inline delete button using the global context action

function DeleteOrgButton({ onDelete, disabled }) {
    const [localLoading, setLocalLoading] = useState(false);
    const handle = async () => {
        setLocalLoading(true);
        await onDelete();
        setLocalLoading(false);
    };
    return (
        <button
            type="button"
            onClick={handle}
            disabled={disabled || localLoading}
            className="glass glass-btn"
        >
            {localLoading ? 'Deleting…' : 'Delete'}
        </button>
    );
}

function OrganizationRow({ org, onUpdate, onDelete, globalLoading }) {
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: org.name, description: org.description || '' });
    const [deleting, setDeleting] = useState(false);

    const submitEdit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setSaving(true);
        const { error } = await onUpdate(org.id, { name: form.name, description: form.description });
        setSaving(false);
        if (!error) setEditing(false);
    };

    const handleDelete = async () => {
        if (!window.confirm('Organisation wirklich löschen?')) return;
        setDeleting(true);
        const { error } = await onDelete(org.id);
        setDeleting(false);
        if (error) console.error('Delete failed:', error);
    };

    if (editing) {
        return (
            <li className="p-3 rounded border border-[var(--border)] bg-[var(--bg-tertiary)] shadow-sm flex flex-col gap-3">
                <form onSubmit={submitEdit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                        required
                        className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        value={form.description}
                        onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                        className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
                        placeholder="Beschreibung"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="glass glass-btn"
                        >{saving ? 'Speichern…' : 'Speichern'}</button>
                        <button
                            type="button"
                            onClick={() => { setEditing(false); setForm({ name: org.name, description: org.description || '' }); }}
                            className="glass glass-btn"
                        >Abbrechen</button>
                    </div>
                </form>
            </li>
        );
    }

    return (
        <li className="flex items-center justify-between p-3 rounded border border-[var(--border)] bg-[var(--bg-tertiary)] shadow-sm">
            <span>
                <span className="font-medium">{org.name}</span>
                <span className="ml-2 text-sm text-[var(--text-secondary)]">{org.description}</span>
            </span>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setEditing(true)}
                    disabled={globalLoading}
                    className="glass glass-btn"
                >Edit</button>
                <DeleteOrgButton
                    onDelete={handleDelete}
                    disabled={globalLoading || deleting}
                />
            </div>
        </li>
    );
}