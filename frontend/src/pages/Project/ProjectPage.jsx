import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocuments } from '@/shared/hooks/useDocuments';
import { useProjects } from '@/shared/hooks/useProjects';
import { Modal, EntityFormDialog, DokumentFormDialog, ActionButton, ConfirmDeleteDialog } from '@/shared/components';
import { Table } from '@/shared/components/TableProject/Table';

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

  const { documents, addDocument } = useDocuments(projectId);
  const [localDocuments, setLocalDocuments] = useState([]);

  useEffect(() => {
    if (!documents) return setLocalDocuments([]);

    setLocalDocuments((prev) => {
      const byKey = new Map();
      prev.forEach((p) => {
        if (p.id) byKey.set(p.id, p);
        if (p.title) byKey.set(`title:${p.title}`, p);
      });

      const merged = documents.map((d) => {
        const local = byKey.get(d.id) || byKey.get(`title:${d.title}`) || {};
        return {
          ...d,
          state: local.state ?? d.state ?? '',
          version: local.version ?? d.version ?? '',
          date: local.date ?? d.date ?? (d.created_at ? new Date(d.created_at).toLocaleString() : undefined),
        };
      });

      // include any local-only items that don't exist on server yet
      const serverKeys = new Set(merged.map((m) => (m.id ? m.id : `title:${m.title}`)));
      const localsNotOnServer = prev.filter((p) => {
        const key = p.id ? p.id : `title:${p.title}`;
        return !serverKeys.has(key);
      });

      return [...localsNotOnServer, ...merged];
    });
  }, [documents]);

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

        <hr className="border-white/20 distance-bottom-md" />

        <section>
          <Table data={localDocuments} />
        </section>

        <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)}>
          <DokumentFormDialog
            title="Create Document"
            submitLabel="Create"
            onCancel={() => setCreateOpen(false)}
            onSubmit={async (data) => {
              // create a temporary local row so table updates immediately
              const tempId = `tmp-${Date.now()}`;
              const tempDoc = {
                id: tempId,
                title: data.title,
                state: data.state,
                version: data.version,
                date: data.date ?? new Date().toLocaleString(),
              };

              setLocalDocuments((prev) => [tempDoc, ...prev]);

              // persist to server
              const { data: created, error } = await addDocument({ title: data.title, status_id: null });

              const serverDoc = created ?? null;

              // replace temp entry with server record (preserve state/version/date)
              setLocalDocuments((prev) => {
                return prev.map((p) => {
                  if (p.id !== tempId) return p;

                  const merged = {
                    ...(serverDoc || {}),
                    id: serverDoc?.id ?? tempId,
                    title: serverDoc?.title ?? data.title,
                    state: data.state,
                    version: data.version,
                    date:
                      data.date ?? (serverDoc?.created_at ? new Date(serverDoc.created_at).toLocaleString() : new Date().toLocaleString()),
                  };

                  return merged;
                });
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