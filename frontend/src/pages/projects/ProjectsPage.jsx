import React, { useEffect, useState } from 'react';
import { useAppData } from '@/shared/context/AppDataContextBase';

function OrgProjects({ org }) {
  const { loadProjectsForOrg, projectsByOrg, createProject, updateProject, deleteProject } = useAppData();
  const projects = projectsByOrg[org.id] || [];
  const [expanded, setExpanded] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    if (expanded && projects.length === 0) {
      loadProjectsForOrg(org.id);
    }
  }, [expanded, org.id, projects.length, loadProjectsForOrg]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    await createProject(org.id, newProject);
    setNewProject({ name: '', description: '' });
    setCreating(false);
  };

  return (
    <li style={{ border: '1px solid #ddd', marginBottom: 12, padding: 12, borderRadius: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{org.name}</strong>
        <button type="button" onClick={() => setExpanded(e => !e)}>{expanded ? '−' : '+'}</button>
      </div>
      {expanded && (
        <div style={{ marginTop: 10 }}>
          <p style={{ marginTop: 4, fontSize: 14, color: '#666' }}>{org.description || 'Keine Beschreibung'}</p>
          <h4 style={{ marginTop: 12 }}>Projects</h4>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {projects.map(p => (
              <ProjectRow key={p.id} project={p} orgId={org.id} updateProject={updateProject} deleteProject={deleteProject} />
            ))}
            {projects.length === 0 && <li style={{ fontStyle: 'italic', color: '#999' }}>Keine Projekte</li>}
          </ul>
          {creating ? (
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.name}
                onChange={e => setNewProject(np => ({ ...np, name: e.target.value }))}
                style={{ flex: '1 1 150px' }}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newProject.description}
                onChange={e => setNewProject(np => ({ ...np, description: e.target.value }))}
                style={{ flex: '2 1 200px' }}
              />
              <button type="submit">Speichern</button>
              <button type="button" onClick={() => { setCreating(false); setNewProject({ name: '', description: '' }); }}>Abbrechen</button>
            </form>
          ) : (
            <button type="button" style={{ marginTop: 8 }} onClick={() => setCreating(true)}>Neues Project</button>
          )}
        </div>
      )}
    </li>
  );
}

function ProjectRow({ project, orgId, updateProject, deleteProject }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: project.name, description: project.description || '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProject(project.id, orgId, form);
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Projekt wirklich löschen?')) return;
    setDeleting(true);
    await deleteProject(project.id, orgId);
  };

  if (editing) {
    return (
      <li style={{ display: 'flex', flexDirection: 'column', gap: 6, background: '#fafafa', padding: 8, borderRadius: 4 }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={saving}>{saving ? 'Speichern …' : 'Speichern'}</button>
            <button type="button" onClick={() => setEditing(false)}>Abbrechen</button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
      <span style={{ flex: 1 }}><strong>{project.name}</strong>{project.description ? ' – ' + project.description : ''}</span>
      <button type="button" onClick={() => setEditing(true)}>Edit</button>
      <button type="button" disabled={deleting} onClick={handleDelete}>{deleting ? 'Löschen…' : 'Löschen'}</button>
    </li>
  );
}

export default function ProjectsPage() {
  const { organizations, user } = useAppData();
  const [expandedAll, setExpandedAll] = useState(false);

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px' }}>
      <h1>Projects nach Organization</h1>
      {!user && <p style={{ color: 'orange' }}>Bitte einloggen.</p>}
      {organizations.length === 0 && <p style={{ color: '#666' }}>Keine Organizations.</p>}
      <div style={{ marginBottom: 12 }}>
        <button type="button" onClick={() => setExpandedAll(v => !v)}>{expandedAll ? 'Alle schließen' : 'Alle öffnen'}</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {organizations.map(org => (
          <OrgProjects key={org.id} org={org} />
        ))}
      </ul>
    </div>
  );
}
