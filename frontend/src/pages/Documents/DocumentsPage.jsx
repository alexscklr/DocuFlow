import { useParams, Link } from "react-router-dom";

const MOCK_DOCS = [
  { id: "doc-1", project_id: "project-1", title: "Projektplan", state: "Draft", version: "v0.5" },
  { id: "doc-2", project_id: "project-1", title: "Risikoliste", state: "Review", version: "v0.9" },
  { id: "doc-3", project_id: "project-2", title: "HR Policy", state: "Final", version: "v1.0" },
  { id: "doc-4", project_id: "project-3", title: "Pilot Scope", state: "Draft", version: "v0.3" },
  { id: "doc-5", project_id: "project-4", title: "Onboarding Playbook", state: "Review", version: "v0.8" },
];

export function DocumentsPage() {
  const { projectId, orgId } = useParams();
  const docs = MOCK_DOCS.filter((doc) => doc.project_id === projectId);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold">Documents</h2>

      <div className="glass overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">State</th>
              <th className="py-3 px-4">Version</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} className="border-t border-white/5">
                <td className="py-3 px-4">{doc.title}</td>
                <td className="py-3 px-4">
                  <span className="glass px-2 py-1 text-xs">{doc.state}</span>
                </td>
                <td className="py-3 px-4">{doc.version}</td>
                <td className="py-3 px-4 text-right">
                  <Link
                    to={`/organizations/${orgId}/projects/${projectId}/documents/${doc.id}`}
                    className="glass-btn inline-flex"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {docs.length === 0 && (
              <tr>
                <td
                  className="py-4 px-4 text-center text-white/60"
                  colSpan={4}
                >
                  Noch keine Dokumente vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
