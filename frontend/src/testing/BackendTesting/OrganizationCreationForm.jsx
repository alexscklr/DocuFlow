import { useState, useEffect } from 'react';

export function OrganizationCreationForm({ addOrganization, loading }) {
  const [formData, setformData] = useState({ name: '', description: '' });
  const [orgData, setOrgData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await addOrganization({ name: formData.name, description: formData.description });
    if (!error) setOrgData(data);
  };

  useEffect(() => {
    console.log("Organization creation data:", orgData);
  }, [orgData]);

  return (
    <>
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
    </>
  );
}
