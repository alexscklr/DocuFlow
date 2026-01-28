import { useParams } from "react-router-dom";
import { ProjectField } from '@/shared/components';
import { useUserProjects } from "@/shared/hooks/useProfile";
import { useAppData } from '@/shared/context/AppDataContextBase';

export function ProfilePage() {
  const { projects, loading } = useUserProjects();
  const { profile } = useAppData();
  

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
         <div className="w-[220px] h-[220px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="User avatar"
                className="w-full h-full object-cover"
              />) : (<span className="text-gray-500">No avatar</span> )}
          </div>
          <button className="glass-btn w-full">Edit</button>
        </section>

        {/* right side */}
        <section>
          <h1 className="text-4xl text-left font-semibold  distance-bottom-sm">{profile?.display_name || 'Name is not set yet'}</h1>
          <hr className="border-white/20 distance-bottom-md"/>

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
            <h2 className="text-xl font-semibold flex items-center gap-2 distance-bottom-sm"> <span>👤</span> Personal Information </h2>
           
            <div className="grid grid-cols-1 border glass rounded-lg p-4">
              <p className="text-2xs text-left distance-bottom-md disa">E-Mail: <span className="text-2xs text-left text-white">{profile?.email || 'Email is not set yet'}</span></p>

              <p className="text-2xs text-left ">Phone: <span className="text-2xs text-left text-white">{profile?.phone_number || 'Phone is not set yet'}</span></p>
            </div>  
          </section>

        </section>
      </div>
    </div>
  );
};