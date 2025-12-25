import { useState, useEffect } from 'react';
import { useProjects } from '@/shared/hooks/useProjects';
import { useAuthSession } from '@/shared/hooks/useAuthSession';
import RolesManager from '@/testing/RolesManager.jsx';

export function RolesManagement({ organizations, loading }) {
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const { user } = useAuthSession();
  
  // Load organization projects OR all user projects if no org selected
  const { projects, loadProjects } = useProjects(
    selectedOrgId || null,
    !selectedOrgId ? { organizations, userId: user?.id } : undefined
  );
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    if (selectedOrgId) {
      loadProjects();
      setSelectedProjectId(null);
    }
  }, [selectedOrgId, loadProjects]);

  const hasOrganizations = organizations.length > 0;

  return (
    <section className="glass p-6 w-stretch flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Rollen Verwaltung</h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Organization wählen (optional)</label>
            <select
              value={selectedOrgId ?? ''}
              onChange={(e) => setSelectedOrgId(e.target.value || null)}
              className="px-2 py-2 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
              disabled={!hasOrganizations}
            >
              <option value="">-- keine --</option>
              {organizations.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
            {!hasOrganizations && (
              <span className="text-xs text-[var(--text-secondary)]">Noch keine Organizations verfügbar</span>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {selectedOrgId ? 'Project wählen (der gewählten Org)' : 'Project wählen (alle zugänglichen)'}
            </label>
            <select
              value={selectedProjectId ?? ''}
              onChange={(e) => setSelectedProjectId(e.target.value || null)}
              disabled={projects.length === 0}
              className="px-2 py-2 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)] disabled:opacity-50"
            >
              <option value="">-- keines --</option>
              {projects.map(p => (
                <option key={p.id ?? p.project_id} value={p.id ?? p.project_id}>{p.name}</option>
              ))}
            </select>
            {projects.length === 0 && (
              <span className="text-xs text-[var(--text-secondary)]">
                {selectedOrgId ? 'Keine Projekte in dieser Org' : 'Keine zugänglichen Projekte'}
              </span>
            )}
          </div>
          
          {selectedOrgId && (
            <button
              type="button"
              onClick={() => loadProjects()}
              className="glass glass-btn h-[42px]"
              disabled={loading}
            >Projekte neu laden</button>
          )}
        </div>

        {/* Organization Roles */}
        {selectedOrgId && (
          <div>
            <RolesManager scope="organization" organizationId={selectedOrgId} />
          </div>
        )}

        {/* Project Roles */}
        {selectedProjectId && (
          <div>
            <RolesManager scope="project" projectId={selectedProjectId} />
          </div>
        )}

        {/* Document Roles - per Project */}
        {selectedProjectId && (
          <div>
            <RolesManager scope="document" projectId={selectedProjectId} />
          </div>
        )}

        {/* No selection message */}
        {!selectedOrgId && !selectedProjectId && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-sm text-[var(--text-secondary)]">
            Wähle eine Organization oder ein Projekt, um deren Rollen zu verwalten
          </div>
        )}
      </div>
    </section>
  );
}
