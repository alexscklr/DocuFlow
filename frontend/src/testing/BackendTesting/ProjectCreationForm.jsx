import { useState, useEffect } from 'react';

export function ProjectCreationForm({ organizations, loading }) {
  const [formData, setformData] = useState({ name: '', description: '', organization_id: '' });
  const [projectData, setProjectData] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.organization_id) {
      alert('Bitte wähle eine Organization');
      return;
    }
    setIsCreating(true);
    // Import dynamically to avoid circular dependency
    const { createProject } = await import('@/shared/lib/projectQueries');
    const { data, error } = await createProject({
      organization_id: formData.organization_id,
      name: formData.name,
      description: formData.description
    });
    setIsCreating(false);
    if (!error) {
      setProjectData(data);
      setformData({ name: '', description: '', organization_id: formData.organization_id });
    }
  };

  useEffect(() => {
    console.log("Project creation data:", projectData);
  }, [projectData]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 glass p-6 w-stretch"
      >
        <h2 className="text-xl font-semibold mb-2">Create Project</h2>
        
        <select
          value={formData.organization_id}
          onChange={(e) => setformData({ ...formData, organization_id: e.target.value })}
          className="px-3 py-2 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          required
        >
          <option value="">-- Organization wählen --</option>
          {organizations.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Project Name"
          value={formData.name}
          onChange={(e) => setformData({ ...formData, name: e.target.value })}
          className="px-3 py-2 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          required
        />
        <input
          type="text"
          placeholder="Project Description"
          value={formData.description}
          onChange={(e) => setformData({ ...formData, description: e.target.value })}
          className="px-3 py-2 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button
          type="submit"
          className="glass glass-btn mt-4 px-6 w-39 whitespace-nowrap"
          disabled={loading || isCreating}
        >
          {isCreating ? 'Creating…' : 'Create Project'}
        </button>
      </form>

      {projectData && (
        <div className="mt-6 w-full max-w-md border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] p-4 shadow">
          <h2 className="text-lg font-semibold mb-1">Project Created:</h2>
          <p className="text-[var(--success)]">
            Name: {projectData.name} <br />
            Description: {projectData.description}
          </p>
        </div>
      )}
    </>
  );
}
