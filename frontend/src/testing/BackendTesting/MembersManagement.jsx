import { useState, useEffect } from 'react';
import { useProjects } from '@/shared/hooks/useProjects';
import OrganizationMembers from '@/testing/OrganizationMembers/OrganizationMembers.jsx';
import ProjectMembers from '@/testing/ProjectMembers/ProjectMembers.jsx';
import InviteToOrganization from '@/testing/InviteToOrganization.jsx';
import InviteToProject from '@/testing/InviteToProject.jsx';
import RolesManager from '@/testing/RolesManager.jsx';

export function MembersManagement({ organizations, loading }) {
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const { projects, loadProjects } = useProjects(selectedOrgId);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    if (selectedOrgId) {
      loadProjects();
      setSelectedProjectId(null);
    }
  }, [selectedOrgId, loadProjects]);

  return (
    <section className="glass p-6 w-stretch flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Members Verwaltung</h2>
      {organizations.length === 0 && (
        <p className="text-[var(--text-secondary)] text-sm">Noch keine Organizations verfügbar.</p>
      )}
      {organizations.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
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
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Project wählen (der gewählten Org)</label>
              <select
                value={selectedProjectId ?? ''}
                onChange={(e) => setSelectedProjectId(e.target.value || null)}
                disabled={!selectedOrgId || projects.length === 0}
                className="px-2 py-2 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)] disabled:opacity-50"
              >
                <option value="">-- keines --</option>
                {projects.map(p => (
                  <option key={p.id ?? p.project_id} value={p.id ?? p.project_id}>{p.name}</option>
                ))}
              </select>
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
          {selectedOrgId && (
            <div className="flex flex-col gap-4">
              <OrganizationMembers organizationId={selectedOrgId} />
              <InviteToOrganization organizationId={selectedOrgId} />
              <RolesManager scope="organization" organizationId={selectedOrgId} />
              {selectedProjectId && (
                <>
                  <ProjectMembers projectId={selectedProjectId} />
                  <InviteToProject projectId={selectedProjectId} />
                  <RolesManager scope="project" projectId={selectedProjectId} />
                </>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
