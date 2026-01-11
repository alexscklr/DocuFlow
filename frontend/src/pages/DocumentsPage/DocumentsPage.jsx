import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocuments } from '@/shared/hooks/useDocuments';
import { useDocumentVersions } from '@/shared/hooks/useDocumentVersions';
import { useProjects } from '@/shared/hooks/useProjects';
import { Modal, ActionButton, DocumentsUploadDialog } from '@/shared/components';
import { uploadDocumentFile, createDocumentVersion, downloadVersionFile } from '@/shared/lib/documentVersionsQueries';


export function DocumentsPage() {
  const { orgId, projectId, documentId } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [project, setProject] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { documents, loadDocuments } = useDocuments(projectId);
  const { getProjectById } = useProjects(null);
  
  // Get versions for the document
  const { versions, loadVersions } = useDocumentVersions(documentId);

  // Load document and project on component mount
  useEffect(() => {
    const loadData = async () => {
      if (projectId) {
        // Load project
        const { data: projectData, error: projectError } = await getProjectById(projectId);
        if (!projectError && projectData) {
          setProject(projectData);
        }

        // Load documents to find the specific one
        await loadDocuments();
      }
    };
    loadData();
  }, [projectId, getProjectById, loadDocuments]);

  // Set document when documents are loaded
  useEffect(() => {
    if (documents && documentId) {
      const foundDocument = documents.find(d => d.id === documentId);
      if (foundDocument) {
        setDocument(foundDocument);
      }
    }
  }, [documents, documentId]);

  // Load versions when document is available
  useEffect(() => {
    if (documentId) {
      loadVersions();
    }
  }, [documentId, loadVersions]);

  const handleUpload = async ({ documentId: docId, file, changeNote }) => {
    if (!project || !project.organization_id || !file) {
      alert('Missing required information for upload');
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const filePath = await uploadDocumentFile({
        organizationId: project.organization_id,
        projectId: project.id,
        documentId: docId || documentId,
        file
      });

      // Create document version
      await createDocumentVersion({
        documentId: docId || documentId,
        filePath,
        changeNote: changeNote || 'Uploaded via Documents page'
      });

      alert('File uploaded successfully!');
      setUploadOpen(false);
      await loadVersions(); // Reload versions to show new upload
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Error uploading file: ${error.message || error}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async ({ documentId: docId }) => {
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
        const a = window.document.createElement('a');
        const fileName = latestVersion.file_url.split('/').pop() || `document-${docId || documentId}`;
        a.href = url;
        a.download = fileName;
        window.document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        alert('File downloaded successfully!');
      }
      
      setDownloadOpen(false);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert(`Error downloading file: ${error.message || error}`);
    } finally {
      setDownloading(false);
    }
  };

  if (!document) {
    return (
      <div className="px-8 py-20">
        <p>Document not found</p>
        <button onClick={() => navigate(-1)}>← Back</button>
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
            <h1 className="text-4xl text-left font-semibold distance-bottom-sm">
              {document.title || 'Untitled Document'}
            </h1>
            <p className="text-2xs font-semibold text-left truncate max-w-[60ch]">
              {project?.name || 'No project'} • Created: {document.created_at ? new Date(document.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="flex gap-4">
            <ActionButton
              variant="upload"
              onClick={() => setUploadOpen(true)}
            />
            <ActionButton
              variant="download"
              onClick={() => setDownloadOpen(true)}
            />
          </div>
        </div>

        <hr className="border-white/20 distance-bottom-md" />

        <section className="space-y-4">
          <div className="glass rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Document Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Title</p>
                <p className="text-lg text-white">{document.title || 'Untitled Document'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Created</p>
                <p className="text-lg text-white">
                  {document.created_at ? new Date(document.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl overflow-hidden">
            {versions && versions.length > 0 ? (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-3 gap-4 bg-white/5 px-6 py-4 border-b border-white/10">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-300">Version</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-300">Change Note</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-300">Date</p>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/10">
                  {versions.map((version) => (
                    <div 
                      key={version.id} 
                      className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-white/5 transition-colors duration-150"
                    >
                      <div className="text-left">
                        <p className="text-sm text-gray-200">v{version.version_number}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-400">{version.change_note || 'No change note'}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-400">
                          {new Date(version.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-400 text-sm">No versions available yet. Upload a file to create the first version.</p>
              </div>
            )}
          </div>
        </section>

        <Modal isOpen={uploadOpen} onClose={() => setUploadOpen(false)}>
          <DocumentsUploadDialog
            title="Upload Document File"
            mode="upload"
            documents={[document]}
            selectedDocumentId={documentId}
            onDocumentSelect={() => {}}
            onSubmit={handleUpload}
            onCancel={() => setUploadOpen(false)}
            submitLabel="Upload"
            loading={uploading}
          />
        </Modal>

        <Modal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)}>
          <DocumentsUploadDialog
            title="Download Document"
            mode="download"
            documents={[document]}
            selectedDocumentId={documentId}
            onDocumentSelect={() => {}}
            onSubmit={handleDownload}
            onCancel={() => setDownloadOpen(false)}
            submitLabel="Download"
            loading={downloading}
          />
        </Modal>
      </div>
    </div>
  );
}
