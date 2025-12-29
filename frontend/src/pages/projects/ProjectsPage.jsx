import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '@/shared/context/AppDataContextBase';
import { useProjects } from '@/shared/hooks/useProjects';
import { Modal, EntityFormDialog, InfoFieldButton, ActionButton, ConfirmDeleteDialog } from '@/shared/components';


export default function ProjectsPage() {
  const { orgId } = useParams();
  const navigate = useNavigate();

  const { organizations, deleteOrganization, updateOrganization } = useAppData();
  const org = organizations.find(o => String(o.id) === String(orgId));
 
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [editOrgOpen, setEditOrgOpen] = useState(false);
  const [deleteOrgOpen, setDeleteOrgOpen] = useState(false);

  const {
    projects,
    addProject,
    loadProjects,
  } = useProjects(orgId);

  useEffect(() => {
    if (orgId) {
      loadProjects();
    }
  }, [orgId]);

  if (!org) {
    return (
      <div className="px-8 py-20">
        <p>Organization not found</p>
        <button onClick={() => navigate('/organizations')}>
          ← Back
        </button>
      </div>
    );
  }

  return (
   <div className="h-screen text-[var(--color-text)]">
      <div
        className="
          px-4            /* mobile */
          md:px-8         /* tablet */
          xl:px-[250px]   /* desktop / FHD */
          py-[120px]
          space-y-10
        "
      >
       <div className="flex items-center justify-between gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-semibold text-left distance-bottom-sm">
              Projects in {org.name}
            </h1>

            <p className="text-2xs font-semibold text-left truncate max-w-[60ch]">
              {org.description}
            </p>
          </div>

          <div className="flex gap-4 shrink-0 self-end distance-bottom-xs">
            <ActionButton variant="delete" onClick={() => setDeleteOrgOpen(true)} />
            <ActionButton variant="edit" onClick={() => setEditOrgOpen(true)} />
            <ActionButton variant="add" onClick={() => setCreateProjectOpen(true)} />
          </div>
        </div>
        <hr className="border-white/20 distance-bottom-md" />

        <section className="grid gap-8 grid-cols-2">
          {projects.map(project => (
            <InfoFieldButton
              key={project.id}
              title={project.name}
              description={project.description}
              date={project.created_at}
              to={`/organizations/${org.id}/projects/${project.id}`}
          />
          ))}
        </section>

        

        <Modal isOpen={deleteOrgOpen} onClose={() => setDeleteOrgOpen(false)}>
          <ConfirmDeleteDialog
            text={`Are you sure you want to delete the organization "${org.name}"? All projects and documents will be permanently deleted.`}
            onCancel={() => setDeleteOrgOpen(false)}
            onConfirm={async () => {
              await deleteOrganization(org.id);
              navigate('/organizations');
            }}
          />
        </Modal>

        <Modal isOpen={editOrgOpen} onClose={() => setEditOrgOpen(false)}>
          <EntityFormDialog
            title="Edit Organization"
            field1Label="Name"
            field2Label="Description"
            submitLabel="Save"
            initialValues={{
              field1: org.name,
              field2: org.description,
            }}
            onCancel={() => setEditOrgOpen(false)}
            onSubmit={async (data) => {
              const updates = {
                name: data.field1,
                description: data.field2,
              };

              await updateOrganization(org.id, updates);
              setEditOrgOpen(false);
            }}
          />
        </Modal>

        <Modal isOpen={createProjectOpen} onClose={() => setCreateProjectOpen(false)}>
            <EntityFormDialog
              title="Create Project"
              field1Label="Name"
              field2Label="Description"
              submitLabel="Create"
              onCancel={() => setCreateProjectOpen(false)}
              onSubmit={async (data) => {
                await addProject({
                  name: data.field1,
                  description: data.field2,
                });

                await loadProjects();
                setCreateProjectOpen(false);
              }}
            />
        </Modal>

      </div>
    </div>
  );
}
