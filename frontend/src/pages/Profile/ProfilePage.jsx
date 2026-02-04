import { useParams } from "react-router-dom";
import { useState} from 'react';
import { ProjectField } from '@/shared/components';
import { useUserProjects } from "@/shared/hooks/useProfile";
import { useAppData } from '@/shared/context/AppDataContextBase';
import { useProfilesByIds } from "@/shared/hooks/useProfilesByIds";
import { Modal, EntityFormDialog,} from '@/shared/components';
import { uploadAvatar } from '@/shared/lib/profileQueries';

export function ProfilePage() {
  const { profileId } = useParams();
  const { profile: myProfile, updateProfile } = useAppData();
  const [editOpen, setEditOpen] = useState(false);

  const isOwnProfile = myProfile && profileId === myProfile.id;
  const { profilesMap } = useProfilesByIds(isOwnProfile ? [] : [profileId]);
  const profileIdToUse = isOwnProfile ? myProfile.id : profileId;

  const { projects, loading } = useUserProjects(profileIdToUse);

  const profileToShow = isOwnProfile ? myProfile : profilesMap[profileId];
  if (!myProfile) return null;
  if (!profileToShow) return <div>Loading profile…</div>;

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !profileToShow?.id) return;

    try {
      const { data, error } = await uploadAvatar(profileToShow.id, file);
      if (error) throw error;

      await updateProfile({ avatar_url: data.publicUrl });
    } catch (err) {
      console.error('Avatar upload failed:', err.message);
    } finally {
      event.target.value = '';
    }
  };

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
          <label
            className="
              w-[220px] h-[220px]
              rounded-full overflow-hidden
              bg-gray-200
              flex items-center justify-center
              cursor-pointer
              relative
              group
            "
          >
            {profileToShow?.avatar_url ? (
              <img
                src={profileToShow.avatar_url}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500">No avatar</span>
            )}

            {isOwnProfile && (
              <div
                className="
                  absolute inset-0
                  bg-black/40
                  opacity-0 group-hover:opacity-100
                  flex items-center justify-center
                  text-white text-sm
                  transition
                "
              >
                Change avatar
              </div>
            )}

            {isOwnProfile && (
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={loading}
              />
            )}
          </label>
          {isOwnProfile && ( <button className="glass-btn justify-center w-full" onClick={() => setEditOpen(true)} > Edit </button> )}
        </section>

        {/* right side */}
        <section>
          <h1 className="text-4xl text-left font-semibold  distance-bottom-sm">{profileToShow?.display_name || 'Name is not set yet'}</h1>
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
              <p className="text-2xs text-left distance-bottom-md disa">E-Mail: <span className="text-2xs text-left text-white">{profileToShow?.email || 'Email is not set yet'}</span></p>

              <p className="text-2xs text-left ">Phone: <span className="text-2xs text-left text-white">{profileToShow?.phone_number || 'Phone is not set yet'}</span></p>
            </div>  
          </section>
        </section>

        <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}>
          <EntityFormDialog
            title="Edit profile"
            field1Label="Name"
            field2Label="Phone"
            submitLabel="Save"
            initialValues={{
              field1: profileToShow.display_name,
              field2: profileToShow.phone_number,
            }}
            onCancel={() => setEditOpen(false)}
            onSubmit={async (data) => {
              const updates = {
                display_name: data.field1,
                phone_number: data.field2,
              };
              await updateProfile(updates);
              setEditOpen(false);
            }}
          />
        </Modal>
      </div>
    </div>
);
};