import { useParams } from "react-router-dom";

export function ProfilePage() {
  const { profileId } = useParams();

  const initial = profileId ? profileId[0]?.toUpperCase() : "U";

  return (
    <div className="grid grid-cols-[260px,1fr] gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="glass w-40 h-40 rounded-full flex items-center justify-center text-4xl">
          {initial}
        </div>
        <button className="glass-btn w-full justify-center">Edit</button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold mb-1">Name</h2>
          <p className="text-xs text-white/70">Projects &amp; Roles</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-3">
            <p className="text-xs text-white/60 mb-1">Project name</p>
            <p className="text-xs text-white/40">Organization name</p>
          </div>
          <div className="glass p-3" />
        </div>

        <div className="space-y-3 border-t border-white/10 pt-4">
          <div>
            <label className="block text-xs text-white/60 mb-1">Email</label>
            <div className="glass px-3 py-2 text-sm">user@example.com</div>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Phone</label>
            <div className="glass px-3 py-2 text-sm">+49 ...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
