export function ProjectSelector({ projects, value, onChange, disabled = false }) {
  return (
    <div>
      <label className="block text-sm mb-1">Project</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded"
        disabled={disabled}
      >
        <option value="">Projekt wählen…</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>{project.name || project.id}</option>
        ))}
      </select>
    </div>
  );
}
