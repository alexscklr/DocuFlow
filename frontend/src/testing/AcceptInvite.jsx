import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { acceptInvite } from "@/shared/lib/inviteQueries";

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("Kein Token in URL vorhanden.");
      return;
    }

    const accept = async () => {
      const { error } = await acceptInvite(token);

      if (error) {
        setStatus("error");
        setErrorMsg(error.message);
      } else {
        setStatus("success");
        // Redirect nach 2 Sekunden
        setTimeout(() => navigate("/"), 2000);
      }
    };

    accept();
  }, [token, navigate]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass p-8 rounded-xl text-center space-y-4">
          <p className="text-lg font-semibold">Einladung wird angenommen…</p>
          <div className="animate-spin h-8 w-8 border-4 border-[var(--accent)] border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass p-8 rounded-xl text-center space-y-4">
          <p className="text-xl font-semibold text-[var(--success)]">✓ Einladung akzeptiert!</p>
          <p className="text-sm text-[var(--text-secondary)]">Du wirst weitergeleitet…</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass p-8 rounded-xl text-center space-y-4">
          <p className="text-xl font-semibold text-[var(--danger)]">✗ Fehler</p>
          <p className="text-sm text-[var(--text-secondary)]">{errorMsg}</p>
          <button
            onClick={() => navigate("/")}
            className="glass glass-btn mt-4"
          >
            Zur Startseite
          </button>
        </div>
      </div>
    );
  }
}

