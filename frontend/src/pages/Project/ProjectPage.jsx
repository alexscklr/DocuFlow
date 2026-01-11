import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocuments } from '@/shared/hooks/useDocuments';
import { useProjects } from '@/shared/hooks/useProjects';
import { useDocumentStatuses } from '@/shared/hooks/useDocumentStatuses';
import { Modal, EntityFormDialog, DokumentFormDialog, ActionButton, ConfirmDeleteDialog } from '@/shared/components';
import { Table } from '@/shared/components/TableProject/Table';

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { getProjectById, deleteProject, updateProject } = useProjects(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await getProjectById(projectId);
      if (!error) setProject(data);
    }
    load();
  }, [projectId, getProjectById]);

  const { documents, addDocument, loadDocuments } = useDocuments(projectId);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const { statuses } = useDocumentStatuses(projectId);
  
  // Load versions for all documents to get version numbers
  const [documentVersionsMap, setDocumentVersionsMap] = useState({});
  
  useEffect(() => {
    const loadAllVersions = async () => {
      const versionsMap = {};
      for (const doc of documents) {
        if (doc.id) {
          const { getDocumentVersions } = await import('@/shared/lib/documentVersionsQueries');
          const { data } = await getDocumentVersions(doc.id);
          if (data && data.length > 0) {
            versionsMap[doc.id] = data[0]; // Latest version
          }
        }
      }
      setDocumentVersionsMap(versionsMap);
    };
    
    if (documents.length > 0) {
      loadAllVersions();
    }
  }, [documents]);

  const handleLoadDocuments = useCallback(async () => {
    setIsLoadingDocuments(true);
    try {
      await loadDocuments();
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [loadDocuments]);

  useEffect(() => {
    handleLoadDocuments();
  }, []);

  // Format documents for Table component
  const formattedDocuments = documents.map((doc) => {
    // Get status name
    const status = doc.status_id ? statuses.find(s => s.id === doc.status_id) : null;
    const state = status ? status.name : 'Draft';
    
    // Get version number from latest version
    const latestVersion = documentVersionsMap[doc.id];
    const version = latestVersion ? `v${latestVersion.version_number}` : 'No version';
    
    // Format date
    const date = doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'N/A';
    
    return {
      ...doc,
      title: doc.title || 'Untitled Document',
      state,
      version,
      date,
    };
  });


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
          <Table data={formattedDocuments} />
        </section>

        <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)}>
          <DokumentFormDialog
            title="Create Document"
            submitLabel="Create"
            onCancel={() => setCreateOpen(false)}
            onSubmit={async (data) => {
              await addDocument({
                title: data.title,
                status_id: "7c68e50a-d6cd-4439-afcd-17380c2a4cb6",
                created_at: new Date().toLocaleString(),
                current_version_id: null,
              });
              await handleLoadDocuments();
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