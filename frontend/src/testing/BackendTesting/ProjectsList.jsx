import { useState, useEffect } from 'react';
import { useProjects } from '@/shared/hooks/useProjects';
import { ProjectRow } from './ProjectRow';

export function ProjectsList({ organizations, loading }) {
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const { projects, loadProjects, updateProject, deleteProject } = useProjects(selectedOrgId);
  const [projectsLoading, setProjectsLoading] = useState(false);

  useEffect(() => {
    if (selectedOrgId) {
      setProjectsLoading(true);
      loadProjects().finally(() => setProjectsLoading(false));
    }
  }, [selectedOrgId, loadProjects]);

  const fetchProjects = async () => {
    if (!selectedOrgId) return;
    setProjectsLoading(true);
    const { data, error } = await loadProjects();
    setProjectsLoading(false);
    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      console.log('Fetched projects:', data);
    }
  };

  return (
    <section className="glass p-6 w-stretch flex flex-col gap-6">
      <h2 className="text-xl font-semibold mb-2">Get Projects of Organization</h2>
      
      <div className="flex gap-4 items-end">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium">Organization wählen</label>
          <select
            value={selectedOrgId ?? ''}
            onChange={(e) => setSelectedOrgId(e.target.value || null)}
            className="px-2 py-2 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
          >
            <option value="">-- keine --</option>
            {organizations.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={fetchProjects}
          disabled={!selectedOrgId || projectsLoading}
          className="glass glass-btn h-[42px]"
        >
          Fetch Projects {projectsLoading ? '…' : '⟳'}
        </button>
      </div>

      {!selectedOrgId && <p className="text-[var(--text-secondary)] text-sm">Bitte wähle eine Organization</p>}
      
      {selectedOrgId && (
        <ul className="space-y-2">
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              onUpdate={updateProject}
              onDelete={deleteProject}
              globalLoading={loading || projectsLoading}
            />
          ))}
          {projects.length === 0 && !projectsLoading && (
            <li className="italic text-sm text-[var(--text-secondary)]">Keine Projekte</li>
          )}
          {projectsLoading && (
            <li className="text-sm text-[var(--text-secondary)]">Lade Projekte…</li>
          )}
        </ul>
      )}
    </section>
  );
}
