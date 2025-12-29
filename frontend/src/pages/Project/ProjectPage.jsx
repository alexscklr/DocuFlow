import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocuments } from '@/shared/hooks/useDocuments';
import { useProjects } from '@/shared/hooks/useProjects';
import { Modal, EntityFormDialog, ActionButton, ConfirmDeleteDialog } from '@/shared/components';

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { getProjectById, deleteProject, updateProject } = useProjects(projectId);

  useEffect(() => {
    async function load() {
      const { data, error } = await getProjectById(projectId);
      if (!error) setProject(data);
    }
    load();
  }, [projectId, getProjectById]);

  const {addDocument} = useDocuments(projectId);

  if (!project) {
    return (
      <div className="px-8 py-20">
        <p>Project not found</p>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  return (
    <div className="h-screen text-[var(--color-text)]">
      <div
        className="
          px-4
          md:px-8
          xl:px-[250px]
          py-[120px]
          space-y-10
        "
      >
        <div className="flex items-center justify-between gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-semibold text-left distance-bottom-sm">
              Documents in {project.name}
            </h1>

            <p className="text-2xs font-semibold text-left truncate max-w-[60ch]">
              {project.description}
            </p>
          </div>

          <div className="flex gap-4 shrink-0 self-end distance-bottom-xs">
            <ActionButton variant="delete" onClick={() => setDeleteOpen(true)} />
            <ActionButton variant="edit" onClick={() => setEditOpen(true)} />
            <ActionButton variant="add" onClick={() => setCreateOpen(true)} />
          </div>
        </div>

        <hr className="border-white/20" />




        <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)}>
          <EntityFormDialog
            title="Create Document"
            field1Label="Title"
            field2Label="Description"
            submitLabel="Create"
            onCancel={() => setCreateOpen(false)}
            onSubmit={async (data) => {
              await addDocument({
                title: data.field1,
                description: data.field2,
              });
              setCreateOpen(false);
            }}
          />
        </Modal>

        <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <ConfirmDeleteDialog
            text={`Delete project "${project.name}"?`}
            onCancel={() => setDeleteOpen(false)}
            onConfirm={async () => {
              await deleteProject(project.id);
              navigate(-1);
            }}
          />
        </Modal>

        <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}>
          <EntityFormDialog
            title="Edit Project"
            field1Label="Name"
            field2Label="Description"
            submitLabel="Save"
            initialValues={{
              field1: project.name,
              field2: project.description,
            }}
            onCancel={() => setEditOpen(false)}
            onSubmit={async (data) => {
              const updates = {
                name: data.field1,
                description: data.field2,
              };

              const { error } = await updateProject(project.id, updates);

              if (!error) {
                setProject((prev) => ({
                  ...prev,
                  ...updates,
                }));
              }

              setEditOpen(false);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}