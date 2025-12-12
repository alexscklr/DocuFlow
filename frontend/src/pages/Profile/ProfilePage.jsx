import { useParams } from "react-router-dom";
import { ProjectField, InfoField } from '@/shared/components';
import { useAppData } from '@/shared/context/AppDataContextBase';
import { useUserProjectsById, useProfileById } from "@/shared/hooks/useProfile";

export function ProfilePage() {
const { profileId } = useParams();
const { user } = useAppData();

const viewedUserId = profileId ?? user?.id;
const { profile, loading: profileLoading } = useProfileById(viewedUserId);
const { projects, loading: projectsLoading } = useUserProjectsById(viewedUserId);

if (!viewedUserId) {
  return <div className="p-8">Loading profile...</div>;
}

if (profileLoading || projectsLoading) {
  return <div className="p-8">Loading...</div>;
}

if (!profile) {
  return <div className="p-8">Profile not found.</div>;
}

  return (
    <div className="
      px-4            /* mobile */
      md:px-8         /* tablet */
      xl:px-[250px]   /* desktop / FHD */
      py-[120px]
    ">

      <div className="grid grid-cols-[220px_1fr] gap-8">
        {/* left side */}
        <section id="avatarSectionId" className="flex flex-col items-center gap-4">
          <div className="w-[220px] h-[220px] rounded-full bg-gray-300 flex items-center justify-center">
            Avatar
          </div>
          <button className="glass-btn w-full">Edit</button>
        </section>

        {/* right side */}
        <section>
          <h1 className="text-4xl text-left font-semibold  distance-bottom-sm">{profile?.display_name || 'Profile'}</h1>
          <hr className="border-white/20 distance-bottom-md" />

          <section id="projectsSectionId" className="distance-bottom-md">
            <h2 className="text-xl font-semibold flex items-center gap-2 distance-bottom-md"> <span>🗂️</span> Projects </h2>

            <div className="grid grid-cols-2 gap-4">
              {projects.length === 0 ? (
                <p className="text-gray-400 col-span-2">
                  You don’t have any current projects.
                </p>
              ) : (
                projects.map(p => (
                  <ProjectField
                    key={p.id}
                    projectName={p.project.name}
                    organizationName={p.project.organization.name}
                    roleName={p.role.name}
                  />
                ))
              )}
            </div>
          </section>

          <hr className="border-white/20 distance-bottom-md" />

          <section id="personalInfoId" className="distance-bottom-md">
            <h2 className="text-xl font-semibold flex items-center gap-2 distance-bottom-sm"> <span>🗂️</span> Personal Information </h2>

            <div className="grid grid-cols-1">
              <InfoField
                title="E-Mail"
                info={profile?.email || 'N/A'}
              />

              <InfoField
                title="Phone"
                info={profile?.phone_number || 'N/A'}
              />
            </div>
          </section>

        </section>
      </div>
    </div>
  );
};