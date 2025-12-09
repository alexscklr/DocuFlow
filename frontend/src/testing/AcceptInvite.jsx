import { useEffect } from "react";
import supabase from "@/services/supabaseClient";

export default function AcceptInvitation({ invitationId }) {
  useEffect(() => {
    const accept = async () => {
      const { error } = await supabase.rpc("accept_invitation", {
        p_invitation_id: invitationId,
      });

      if (error) {
        alert("Fehler: " + error.message);
      } else {
        alert("Einladung akzeptiert!");
      }
    };

    accept();
  }, [invitationId]);

  return <p>Einladung wird angenommen…</p>;
}
