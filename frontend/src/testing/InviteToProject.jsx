import { useEffect, useState } from "react";
import { sendProjectInvite } from "@/shared/lib/inviteQueries";
import { getRoles } from "@/shared/lib/rolesQueries";

export default function InviteToProject({ projectId }) {
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
    useEffect(() => {
      const loadRoles = async () => {
        const { data } = await getRoles({ scope: 'project', project_id: projectId });
        setRoles(data || []);
      };
      if (projectId) loadRoles();
    }, [projectId]);
  const [loading, setLoading] = useState(false);

  const sendInvite = async () => {
    setLoading(true);

    const { error } = await sendProjectInvite({ email, project_id: projectId, role_id: roleId || null });

    setLoading(false);

    if (error) {
      alert("Fehler: " + error.message);
      return;
    }

    alert("Einladung gesendet!");
    setEmail("");
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">Projektmitglied einladen</h3>

      <input
        type="email"
        className="border p-2 rounded w-full"
        placeholder="E-Mail-Adresse"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <select
        className="border p-2 rounded w-full"
        value={roleId}
        onChange={(e) => setRoleId(e.target.value)}
      >
        <option value="">Rolle wählen (optional)</option>
        {roles.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <button
        onClick={sendInvite}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Senden..." : "Einladen"}
      </button>
    </div>
  );
}
