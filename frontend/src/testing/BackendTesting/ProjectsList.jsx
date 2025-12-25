import { useState, useEffect } from 'react';
import { useProjects } from '@/shared/hooks/useProjects';
import { useAuthSession } from '@/shared/hooks/useAuthSession';
import { ProjectRow } from './ProjectRow';

export function ProjectsList({ organizations, loading }) {
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const { user } = useAuthSession();
  const { projects, loadProjects, updateProject, deleteProject } = useProjects(
    showAllProjects ? null : selectedOrgId,
    showAllProjects ? { organizations, userId: user?.id } : undefined
  );
  const [projectsLoading, setProjectsLoading] = useState(false);

  useEffect(() => {
    if (selectedOrgId && !showAllProjects) {
      setProjectsLoading(true);
      loadProjects().finally(() => setProjectsLoading(false));
    }
  }, [selectedOrgId, loadProjects, showAllProjects]);

  const fetchProjects = async () => {
    if (!showAllProjects && !selectedOrgId) return;
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
      <h2 className="text-xl font-semibold mb-2">Get Projects</h2>
      
      {/* Modus-Umschalter */}
      <div className="flex gap-2 items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAllProjects}
            onChange={(e) => {
              setShowAllProjects(e.target.checked);
              if (e.target.checked) {
                setSelectedOrgId(null);
              }
            }}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Alle meine Projekte anzeigen (org-übergreifend)</span>
        </label>
      </div>

      {!showAllProjects && (
        <div className="flex gap-4 items-end">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium">Organization wählen</label>
            <select
              value={selectedOrgId ?? ''}
              onChange={(e) => setSelectedOrgId(e.target.value || null)}
              className="px-2 py-2 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
            >
              <option value="">— keine —</option>
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
      )}

      {showAllProjects && (
        <button
          type="button"
          onClick={fetchProjects}
          disabled={projectsLoading}
          className="glass glass-btn w-fit"
        >
          Alle Projekte laden {projectsLoading ? '…' : '⟳'}
        </button>
      )}

      {!showAllProjects && !selectedOrgId && <p className="text-[var(--text-secondary)] text-sm">Bitte wähle eine Organization</p>}
      
      {(showAllProjects || selectedOrgId) && (
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
