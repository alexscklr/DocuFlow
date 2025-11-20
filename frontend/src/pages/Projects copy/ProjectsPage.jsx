import { useParams, Link } from "react-router-dom";

const MOCK_PROJECTS = [
  {
    id: "project-1",
    organization_id: "org-1",
    name: "Intranet Redesign",
    description: "Neue UX und Informationsarchitektur fuer das Intranet.",
    created_at: "2024-02-12",
  },
  {
    id: "project-2",
    organization_id: "org-1",
    name: "Employee Handbook",
    description: "Aktualisierung der HR documentation und Policies.",
    created_at: "2024-03-21",
  },
  {
    id: "project-3",
    organization_id: "org-2",
    name: "AI Pilot",
    description: "Use-case Sammlung und Pilotierung interner AI-Tools.",
    created_at: "2023-12-05",
  },
  {
    id: "project-4",
    organization_id: "org-3",
    name: "Customer Onboarding",
    description: "Templates & Checklisten fuer Implementierungsprojekte.",
    created_at: "2024-01-30",
  },
];

export function ProjectsPage() {
  const { orgId } = useParams();
  const projects = MOCK_PROJECTS.filter((project) => project.organization_id === orgId);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-white/70">Organisation</p>
          <h2 className="text-3xl font-semibold">Projects</h2>
        </div>
        <button className="glass-btn">+ Neues Projekt</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/organizations/${orgId}/projects/${project.id}/documents`}
            className="glass card-hover p-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{project.name}</h3>
              <span className="text-xs text-white/60">
                {project.created_at
                  ? new Date(project.created_at).toLocaleDateString()
                  : ""}
              </span>
            </div>
            <p className="text-xs text-white/80 line-clamp-3">
              {project.description ?? "No description yet."}
            </p>
          </Link>
        ))}
      </div>

      <div className="glass flex-1 mt-4 p-6">
        <p className="text-sm text-white/70">
          Waehl ein Projekt aus, um Dokumente und Versionen zu bearbeiten.
        </p>
      </div>
    </div>
  );
}

export function ProjectDetailPage() {
  return (
    <div className="text-sm text-white/80">
      Bitte in der Dokumentenliste ein Dokument auswaehlen.
    </div>
  );
}
