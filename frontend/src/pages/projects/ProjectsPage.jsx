import React, { useEffect, useState } from 'react';
import { useAppData } from '@/shared/context/AppDataContextBase';
import { useProjects } from '@/shared/hooks/useProjects';

function OrgProjects({ org, forceExpand }) {
  const { user } = useAppData();
  const { projects, loadProjects, addProject, updateProject, deleteProject } = useProjects(org.id);
  const [expanded, setExpanded] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const prevForceExpand = React.useRef(forceExpand);

  // Sync with global expand/collapse without interfering with manual toggles
  useEffect(() => {
    if (forceExpand && !expanded) {
      setExpanded(true);
    } else if (!forceExpand && prevForceExpand.current && expanded) {
      // Only collapse when switching from global expand-all to collapse-all
      setExpanded(false);
    }
    prevForceExpand.current = forceExpand;
  }, [forceExpand, expanded]);

  // Lazy load projects when opened first time
  useEffect(() => {
    if (expanded && projects.length === 0) {
      loadProjects();
    }
  }, [expanded, projects.length, loadProjects, user?.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    await addProject(newProject);
    setNewProject({ name: '', description: '' });
    setCreating(false);
  };

  return (
    <li className="border border-[var(--border)] rounded-md p-4 mb-3 bg-[var(--bg-secondary)]">
      <div className="flex items-center justify-between">
        <strong className="text-[var(--text-primary)]">{org.name}</strong>
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="glass glass-btn px-3 py-1"
        >{expanded ? '-' : '+'}</button>
      </div>
      {expanded && (
        <div className="mt-3">
          <p className="text-sm text-[var(--text-secondary)]">{org.description || 'Keine Beschreibung'}</p>
          <h4 className="mt-4 font-semibold">Projects</h4>
          <ul className="list-none pl-0 mt-2 space-y-1">
            {projects.map(p => (
              <ProjectRow key={p.id ?? p.project_id} project={p} updateProject={updateProject} deleteProject={deleteProject} />
            ))}
            {projects.length === 0 && <li className="italic text-[var(--text-secondary)]">Keine Projekte</li>}
          </ul>
          {creating ? (
            <form onSubmit={handleCreate} className="flex flex-wrap gap-2 mt-3">
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.name}
                onChange={e => setNewProject(np => ({ ...np, name: e.target.value }))}
                className="flex-1 min-w-[150px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newProject.description}
                onChange={e => setNewProject(np => ({ ...np, description: e.target.value }))}
                className="flex-[2] min-w-[200px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <button type="submit" className="px-3 py-1 rounded bg-[var(--accent)] text-[var(--text-on-accent)] text-sm font-medium">Speichern</button>
              <button
                type="button"
                onClick={() => { setCreating(false); setNewProject({ name: '', description: '' }); }}
                className="px-3 py-1 rounded bg-[var(--danger)] text-[var(--text-on-accent)] text-sm font-medium"
              >Abbrechen</button>
            </form>
          ) : (
            <button
              type="button"
              className="glass glass-btn mt-3 px-4 py-1"
              onClick={() => setCreating(true)}
            >Neues Project</button>
          )}
        </div>
      )}
    </li>
  );
}

function ProjectRow({ project, updateProject, deleteProject }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: project.name, description: project.description || '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const projectId = project?.id ?? project?.project_id;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (!projectId) {
      console.error('Project ID fehlt, Update abgebrochen.');
      setSaving(false);
      return;
    }
    await updateProject(projectId, form); // useProjects expects (projectId, updates)
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Projekt wirklich löschen?')) return;
    setDeleting(true);
    if (!projectId) {
      console.error('Project ID fehlt, Delete abgebrochen.');
      setDeleting(false);
      return;
    }
    await deleteProject(projectId); // useProjects expects (projectId)
    setDeleting(false);
  };

  if (editing) {
    return (
      <li className="flex flex-col gap-2 bg-[var(--bg-tertiary)] p-3 rounded">
        <form onSubmit={handleSave} className="flex flex-col gap-2">
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
          />
          <input
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-3 py-1 rounded bg-[var(--accent)] text-[var(--text-on-accent)] text-sm">
              {saving ? 'Speichern …' : 'Speichern'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="px-3 py-1 rounded bg-[var(--danger)] text-[var(--text-on-accent)] text-sm">Abbrechen</button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 py-1">
      <span className="flex-1 text-[var(--text-primary)]">
        <strong>{project.name}</strong>{project.description ? ' – ' + project.description : ''}
      </span>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-xs px-2 py-1 rounded bg-[var(--accent)] text-[var(--text-on-accent)]"
      >Edit</button>
      <button
        type="button"
        disabled={deleting}
        onClick={handleDelete}
        className="text-xs px-2 py-1 rounded bg-[var(--danger)] text-[var(--text-on-accent)] disabled:opacity-60"
      >{deleting ? 'Löschen…' : 'Löschen'}</button>
    </li>
  );
}

export default function ProjectsPage() {
  const { organizations, user } = useAppData();
  const [expandedAll, setExpandedAll] = useState(false);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Projects nach Organization</h1>
      {!user && <p className="text-[var(--warning)] mb-4">Bitte einloggen.</p>}
      {organizations.length === 0 && <p className="text-[var(--text-secondary)]">Keine Organizations.</p>}
      <div className="mb-4">
        <button
          type="button"
            onClick={() => setExpandedAll(v => !v)}
          className="px-3 py-1 rounded bg-[var(--accent)] text-[var(--text-on-accent)] text-sm"
        >{expandedAll ? 'Alle schließen' : 'Alle öffnen'}</button>
      </div>
      <ul className="list-none p-0">
        {organizations.map(org => (
          <OrgProjects key={org.id} org={org} forceExpand={expandedAll} />
        ))}
      </ul>
    </div>
  );
}