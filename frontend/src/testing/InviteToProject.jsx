import { useEffect, useState } from "react";
import { sendProjectInvite } from "@/shared/lib/inviteQueries"; // sendInviteEmail - Currently not supported
import { getRoles } from "@/shared/lib/rolesQueries";

export default function InviteToProject({ projectId }) {
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState(null);
  //const [inviteToken, setInviteToken] = useState(null);
  // const [sendingEmail, setSendingEmail] = useState(false); // Currently not supported

  useEffect(() => {
    const loadRoles = async () => {
      const { data } = await getRoles({ scope: 'project', project_id: projectId });
      setRoles(data || []);
    };
    if (projectId) loadRoles();
  }, [projectId]);

  const sendInvite = async () => {
    setLoading(true);
    setInviteUrl(null);

    const { data: token, error } = await sendProjectInvite({ email, project_id: projectId, role_id: roleId || null });

    setLoading(false);

    if (error) {
      alert("Fehler: " + error.message);
      return;
    }
    
    if (token) {
    const url = `${window.location.origin}/invite?token=${token}`;
      setInviteUrl(url);
      //setInviteToken(token);
      setEmail("");
    }
  };

  // Currently not supported due to missing domain for smtp settings
  //
  // const handleSendEmail = async () => {
  //   if (!inviteToken || !email) return;
  //   
  //   setSendingEmail(true);
  //   const { error } = await sendInviteEmail({
  //     email,
  //     token: inviteToken,
  //     type: "project"
  //   });
  //   setSendingEmail(false);
  //
  //   if (error) {
  //     alert("Fehler beim E-Mail-Versand: " + error.message);
  //   } else {
  //     alert("Einladungs-E-Mail wurde gesendet!");
  //   }
  // };

  return (
    <div className="space-y-3 glass p-4 rounded-xl">
      <h3 className="text-lg font-bold">Projektmitglied einladen</h3>

      {!inviteUrl ? (
        <>
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
        </>
      ) : (
        <div className="bg-[var(--bg-secondary)] p-4 rounded border border-[var(--border)]">
          <p className="text-[var(--success)] font-semibold mb-2">✓ Einladung erstellt!</p>
          <p className="text-sm text-[var(--text-secondary)] mb-3">Teile diesen Link mit dem Benutzer:</p>
          <input
            type="text"
            value={inviteUrl}
            readOnly
            className="border p-2 rounded w-full bg-[var(--bg-input)] text-[var(--text-primary)] text-xs mb-2"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(inviteUrl);
              alert("Link kopiert!");
            }}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Link kopieren
          </button>
          {/* Currently not supported
          <button
            onClick={handleSendEmail}
            disabled={sendingEmail}
            className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            {sendingEmail ? "Sende..." : "E-Mail senden"}
          </button>
          */}
          <button
            onClick={() => setInviteUrl(null)}
            className="ml-2 bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            Neue Einladung
          </button>
        </div>
      )}
    </div>
  );
}
