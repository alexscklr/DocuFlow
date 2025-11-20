import { Link } from "react-router-dom";

const MOCK_ORGS = [
  {
    id: "org-1",
    name: "Acme Corp",
    description: "Internal docs for the Acme product teams.",
    created_at: "2024-01-15",
  },
  {
    id: "org-2",
    name: "Globex Labs",
    description: "Labs, pilots and research workspaces.",
    created_at: "2024-03-02",
  },
  {
    id: "org-3",
    name: "Innotech",
    description: "Client delivery and implementation kits.",
    created_at: "2023-11-22",
  },
];

export function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold">Organisation</h2>
          <p className="text-sm text-white/70">Alle Projekte &amp; Teams</p>
        </div>
        <button className="glass-btn">+ Neue Organisation</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_ORGS.map((org) => (
          <Link
            key={org.id}
            to={`/organizations/${org.id}/projects`}
            className="glass card-hover p-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 glass flex items-center justify-center text-xs">
                  Org
                </div>
                <h3 className="font-semibold">{org.name}</h3>
              </div>
              <span className="text-xs text-white/60">
                {org.created_at
                  ? new Date(org.created_at).toLocaleDateString()
                  : ""}
              </span>
            </div>
            <p className="text-xs text-white/80 line-clamp-3">
              {org.description ?? "No description yet."}
            </p>
          </Link>
        ))}
      </div>

      <div className="glass flex-1 mt-4 p-6">
        <p className="text-sm text-white/70">
          WAone eine Organisation aus, um Projekte und Dokumente zu bearbeiten.
        </p>
      </div>
    </div>
  );
}

export function OrganizationDetailPage() {
  // could show org overview / roles etc. For now, redirect user to projects via navigation.
  return (
    <div className="text-sm text-white/80">
      Bitte oben A9ber die Navigation die Projekte der Organisation Affnen.
    </div>
  );
}
