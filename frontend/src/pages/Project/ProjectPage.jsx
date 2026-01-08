import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocuments } from '@/shared/hooks/useDocuments';
import { useProjects } from '@/shared/hooks/useProjects';
import { useDocumentVersions } from '@/shared/hooks/useDocumentVersions';
import { useDocumentStatuses } from '@/shared/hooks/useDocumentStatuses';
import { Modal, EntityFormDialog, DokumentFormDialog, ActionButton, ConfirmDeleteDialog, DocumentsUploadDialog } from '@/shared/components';
import { Table } from '@/shared/components/TableProject/Table';
import { uploadDocumentFile, createDocumentVersion, downloadVersionFile } from '@/shared/lib/documentVersionsQueries';

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
  
  // Get versions for selected document (for download)
  const { versions, loadVersions } = useDocumentVersions(selectedDocumentId);
  
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

  // Load versions when document is selected for download
  useEffect(() => {
    if (selectedDocumentId && downloadOpen) {
      loadVersions();
    }
  }, [selectedDocumentId, downloadOpen, loadVersions]);

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

  const handleUpload = async ({ documentId, file, changeNote }) => {
    if (!project || !project.organization_id) {
      alert('Project must be associated with an organization');
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const filePath = await uploadDocumentFile({
        organizationId: project.organization_id,
        projectId: project.id,
        documentId,
        file
      });

      // Create document version
      await createDocumentVersion({
        documentId,
        filePath,
        changeNote: changeNote || 'Uploaded via Project page'
      });

      alert('File uploaded successfully!');
      setUploadOpen(false);
      setSelectedDocumentId(null);
      await handleLoadDocuments();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Error uploading file: ${error.message || error}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async ({ documentId }) => {
    if (!versions || versions.length === 0) {
      alert('No versions available for this document');
      return;
    }

    const latestVersion = versions[0]; // Versions are ordered by version_number descending
    if (!latestVersion.file_url) {
      alert('No file available for this document version');
      return;
    }

    setDownloading(true);
    try {
      const { data: blob, error } = await downloadVersionFile(latestVersion.file_url);
      
      if (error) throw error;

      if (blob) {
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const fileName = latestVersion.file_url.split('/').pop() || `document-${documentId}`;
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        alert('File downloaded successfully!');
      }
      
      setDownloadOpen(false);
      setSelectedDocumentId(null);
      await handleLoadDocuments();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert(`Error downloading file: ${error.message || error}`);
    } finally {
      setDownloading(false);
    }
  };

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
            <ActionButton variant="upload" onClick={() => setUploadOpen(true)} />
            <ActionButton variant="download" onClick={() => setDownloadOpen(true)} />
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

        <Modal isOpen={uploadOpen} onClose={() => {
          setUploadOpen(false);
          setSelectedDocumentId(null);
        }}>
          <DocumentsUploadDialog
            title="Upload Document"
            mode="upload"
            documents={documents}
            selectedDocumentId={selectedDocumentId}
            onDocumentSelect={setSelectedDocumentId}
            onSubmit={handleUpload}
            onCancel={() => {
              setUploadOpen(false);
              setSelectedDocumentId(null);
            }}
            submitLabel="Upload"
            loading={uploading}
          />
        </Modal>

        <Modal isOpen={downloadOpen} onClose={() => {
          setDownloadOpen(false);
          setSelectedDocumentId(null);
        }}>
          <DocumentsUploadDialog
            title="Download Document"
            mode="download"
            documents={documents}
            selectedDocumentId={selectedDocumentId}
            onDocumentSelect={setSelectedDocumentId}
            onSubmit={handleDownload}
            onCancel={() => {
              setDownloadOpen(false);
              setSelectedDocumentId(null);
            }}
            submitLabel="Download"
            loading={downloading}
          />
        </Modal>
      </div>
    </div>
  );
}