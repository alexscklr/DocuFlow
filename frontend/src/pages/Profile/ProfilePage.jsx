import { useParams } from "react-router-dom";
import { ProjectField } from '@/shared/components';
import { useUserProjects } from "@/shared/hooks/useProfile";

export function ProfilePage() {
  const { profileId } = useParams();
  const { projects, loading } = useUserProjects();

  const initial = profileId ? profileId[0]?.toUpperCase() : "U";

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
          <h1 className="text-4xl text-left font-semibold  distance-bottom-sm">Name</h1>
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
            <h2 className="text-xl font-semibold flex items-center gap-2 distance-bottom-sm"> <span>🗂️</span> Personal Information </h2>
           
            <div className="grid grid-cols-1">
              <p className="text-s text-left distance-bottom-xs">E-Mail</p>
              <div className="border rounded-lg p-2 distance-bottom-md">
                <p className="text-xs text-left text-gray-500">g@gmail.com</p>
              </div>

              <p className="text-s text-left distance-bottom-xs">Phone</p>
              <div className="border rounded-lg p-2 distance-bottom-md">
                 <p className="text-xs text-left text-gray-500">+49151151515</p>
              </div>

            </div>  
          </section>

        </section>
      </div>
    </div>
  );
};